import azure.functions as func
from azure.cosmos import CosmosClient
import os
import logging
import datetime
import json
import jwt
from shared_code import streaming
import requests
from azure.messaging.webpubsubservice import (
    WebPubSubServiceClient
)
from jwt import PyJWKClient
from msal import ConfidentialClientApplication

app = func.FunctionApp()

client = CosmosClient("https://livefeed-storage.documents.azure.com:443/", "RMcJvdRXCSCk60vX8ga7uAdnfl2yKW1nGBDf0EKcHc8NtdwKs72NAq2mDtUk8hW6NWwN3RnXMUFxACDbWLE70A==")
database = client.get_database_client('Recipes')
recipe_container = database.get_container_client('UploadedRecipes')
stream_container = database.get_container_client('Streams')

NOTIFY_HUB_NAME = 'livefeed-notify'
CHAT_HUB_NAME = 'livefeed'
PUBSUB_CONNECTION_STRING = os.environ.get('WebPubSubConnectionString')
CHAT_PUBSUB_SERVICE = WebPubSubServiceClient.from_connection_string(PUBSUB_CONNECTION_STRING, hub=CHAT_HUB_NAME)

CLIENT_ID = os.environ.get("AzureB2CAppID")
TENANT_ID = os.environ.get("AzureB2CTenantID")
TENANT_NAME = os.environ.get("AzureB2CTenantName")
POLICY_NAME = os.environ.get("AzureB2CPolicyName")
SECRET = os.environ.get("AzureB2CAppSecret")

ISSUER = f"https://{TENANT_NAME}.b2clogin.com/{TENANT_ID}/v2.0/"
JWKS_URL = f"https://{TENANT_NAME}.b2clogin.com/{TENANT_NAME}.onmicrosoft.com/discovery/v2.0/keys?p={POLICY_NAME}"

msal_client = ConfidentialClientApplication(
    client_id=CLIENT_ID,
    client_credential=SECRET,
    authority=f"https://login.microsoftonline.com/{TENANT_ID}"
)

def get_web_access_token():
    result = msal_client.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception("Access token not acquired")

def get_display_name(object_id):
    token = get_web_access_token()
    headers = {"Authorization": f"Bearer {token}"}
    url = f"https://graph.microsoft.com/v1.0/users/{object_id}"

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        user_data = response.json()
        return user_data.get("displayName")
    else:
        raise Exception(f"Couldn't get user: {response.status_code}, {response.text}")
    
def validate_token(token):
    """
    Validates a token and returns its associated claims.

    Args:
        token (string): The access token provided by the client app.
    Returns:
        claim_info (dict): A dictionary containing 'claims' if the provided token is valid,
        and an 'error' containing a HttpResponse if the token is invalid.
    """
    claim_info = {'claims': None, 'error': None}
    try:
        # Get JWKS keys
        jwks_client = PyJWKClient(JWKS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and validate the token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=ISSUER,
        )

        claim_info['claims'] = payload
    except jwt.ExpiredSignatureError:
        claim_info['error'] = func.HttpResponse("Token has expired", status_code=401)
    except jwt.InvalidTokenError as e:
        claim_info['error'] = func.HttpResponse(f"Invalid token: {e}", status_code=401)
    
    return claim_info

############################
#---- Stream Functions ----#
############################

@app.route(route="chat/negotiate", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def chat_negotiate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received chat token negotiation request')

    username = None
    group = req.params.get('recipeId')

    if not group:
        logging.info('Missing recipe ID')
        return func.HttpResponse("Missing recipe ID from chat negotiation", status_code=400)

    ### Authentication ###
    auth_header = req.headers.get("Authorization")

    if auth_header is None or not auth_header.startswith("Bearer "):
        logging.info("No token provided, treating as anonymous user")
    else:
        logging.info('Found Authorization header')

        token = auth_header.split(" ")[1]
        logging.info('Retrieved token')
        
        claim_info = validate_token(token)
        claims = claim_info.get('claims')
        if (not claims): return claim_info.get('error')

        username = claims.get('name')
        logging.info(f"Identified username of sender as {username}")

        
    ### Authentication ###

    roles=[]

    if username:
        roles.append(f"webpubsub.sendToGroup.{group}")
    else:
        username = group

    token = CHAT_PUBSUB_SERVICE.get_client_access_token(user_id=username, groups=[group], roles=roles)
    
    response_body = json.dumps({'url': token['url']})
    logging.info('Successful chat negotiation')
    return func.HttpResponse(response_body, status_code=200)

#TODO: Validate that the user sending start request is also the creator of the recipe
@app.route(route="stream/{recipeId}/start", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def start_stream(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received stream start request')

    ### Authentication ###
    auth_header = req.headers.get("Authorization")

    if auth_header is None or not auth_header.startswith("Bearer "):
        return func.HttpResponse("Unauthorized", status_code=401)
    logging.info('Found Authorization header')

    token = auth_header.split(" ")[1]
    logging.info('Retrieved token')
    
    claim_info = validate_token(token)
    claims = claim_info.get('claims')
    if (not claims): return claim_info.get('error')
    ### Authentication ###

    user_id = claims.get('sub')
    logging.info(f"Identified sender as {user_id}")

    recipe_id = req.route_params.get('recipeId')

    if not recipe_id:
        logging.info("No recipe ID specified")
        return func.HttpResponse("Missing recipe ID", status_code=400)

    response = streaming.start_stream(recipe_id)

    if (response.streaming_state == "STOPPED"):
        return func.HttpResponse("Error while starting stream", status_code=500)
    else:
        return func.HttpResponse("Livestream successfully started")
    
#TODO: Validate that user sending end request is also the creator of the recipe
@app.route(route="stream/{recipeId}/end", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def end_stream(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received stream start request')

    ### Authentication ###
    auth_header = req.headers.get("Authorization")

    if not auth_header.startswith("Bearer "):
        return func.HttpResponse("Unauthorized", status_code=401)

    token = auth_header.split(" ")[1]
    
    claim_info = validate_token(token)
    claims = claim_info.get('claims')
    if (not claims): return claim_info.get('error')
    ### Authentication ###

    user_id = claims.get('sub')
    logging.info(f"Identified sender as {user_id}")

    recipe_id = req.route_params.get('recipeId')

    vod_url = streaming.save_vod(recipe_id)
    response = streaming.stop_stream(recipe_id)

    stream_data = stream_container.read_item(recipe_id, partition_key=recipe_id)
    stream_data['stream_url'] = vod_url
    stream_container.upsert_item(stream_data)

    if (response.streaming_state == "STOPPED"):
        return func.HttpResponse("Livestream successfully ended")
    else:
        return func.HttpResponse("Error while ending livestream", status_code=500)

############################
#---- Recipe Functions ----#
############################

@app.route(route="recipe/create", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def create_recipe(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received recipe create request')

    ### Authentication ###
    auth_header = req.headers.get("Authorization")

    if not auth_header.startswith("Bearer "):
        return func.HttpResponse("Unauthorized", status_code=401)

    token = auth_header.split(" ")[1]
    
    claim_info = validate_token(token)
    claims = claim_info.get('claims')
    if (not claims): return claim_info.get('error')
    ### Authentication ###

    user_id = claims.get('sub')
    logging.info(f"Identified sender as {user_id}")
    
    info = req.get_json()
    title = info.get('title')
    steps = info.get('steps')
    shopping = info.get('shopping')
    date = info.get('scheduledDate')
    
    recipe_dict = {
        "user_id": user_id,
        "title": title,
        "steps": steps,
        "shopping": shopping,
        "date": date
    }
    
    cosmos_dict = recipe_container.create_item(body=recipe_dict, enable_automatic_id_generation=True)
    recipe_id = cosmos_dict.get('id')

    logging.info(f"Auto-generated recipe ID: {recipe_id}")

    channel_info = streaming.create_recipe_channel(recipe_id)
    stream_url = channel_info.output.uri
    stream_dict = {
        "id": recipe_id,
        "user_id": user_id,
        "stream_url": stream_url,
        "step_timings": {}
    }

    stream_container.create_item(body=stream_dict, enable_automatic_id_generation=False)

    return func.HttpResponse(json.dumps({"recipe_created": "OK"}), status_code=201, mimetype="application/json")

def get_stream_from_db(recipe_id):
    stream_data = stream_container.read_item(recipe_id, partition_key=recipe_id)
    streamer_id = stream_data.get('user_id')
    recipe_data = recipe_container.read_item(recipe_id, partition_key=streamer_id)
    step_timings = stream_data.get('step_timings')

    timed_steps = [{"id": step.get('id'), "text": step.get('text'), "time": step_timings.get(step.get('id'))} for step in recipe_data.get('steps')]

    stream_dict = {
        "name": recipe_data.get('title'),
        "stream": stream_data.get("stream_url"),
        "streamer": get_display_name(streamer_id),
        "group": recipe_id,
        "recipe": timed_steps,
        "shopping": recipe_data.get('shopping')
    }

    return stream_dict

@app.route(route='stream/{recipeId}', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def get_stream_info(req: func.HttpRequest) -> func.HttpResponse:
    recipe_id = req.route_params.get('recipeId')
    stream_dict = get_stream_from_db(recipe_id)

    return func.HttpResponse(json.dumps(stream_dict), mimetype='application/json')

@app.route(route='vod/{recipeId}', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def get_vod_info(req: func.HttpRequest) -> func.HttpResponse:
    recipe_id = req.route_params.get('recipeId')
    stream_dict = get_stream_from_db(recipe_id)

    return func.HttpResponse(json.dumps(stream_dict), mimetype='application/json')
