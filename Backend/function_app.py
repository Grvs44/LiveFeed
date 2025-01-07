import time
import azure.functions as func
from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosResourceNotFoundError
import os
import logging
import datetime
import json
import jwt
from shared_code import messages, streaming
import requests
from azure.messaging.webpubsubservice import (
    WebPubSubServiceClient
)
from jwt import PyJWKClient
from msal import ConfidentialClientApplication
from datetime import datetime, timezone

app = func.FunctionApp()

client = CosmosClient("https://livefeed-storage.documents.azure.com:443/", "RMcJvdRXCSCk60vX8ga7uAdnfl2yKW1nGBDf0EKcHc8NtdwKs72NAq2mDtUk8hW6NWwN3RnXMUFxACDbWLE70A==")
database = client.get_database_client('Recipes')
user_database = client.get_database_client('Users')
recipe_container = database.get_container_client('UploadedRecipes')
stream_container = database.get_container_client('Streams')
prefs_container = user_database.get_container_client('Preferences')

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
current_date = datetime.now(timezone.utc).isoformat(timespec='minutes')

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
    
def validate_token(req):
    """
    Validates a token and returns its associated claims.

    Args:
        token (string): The access token provided by the client app.
    Returns:
        claim_info (dict): A dictionary containing 'claims' if the provided token is valid,
        and an 'error' containing a HttpResponse if the token is invalid.
    """
    auth_header = req.headers.get("Authorization")
    claim_info = {'claims': None, 'error': None}

    if auth_header is None or not auth_header.startswith("Bearer "):
        claim_info['error'] = func.HttpResponse("No token provided", status_code=401)
        return claim_info
    token = auth_header.split(" ")[1]

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
        logging.info(f"Identified sender as {payload.get('name')} ({payload.get('sub')})")
    except jwt.ExpiredSignatureError:
        claim_info['error'] = func.HttpResponse("Token has expired", status_code=401)
    except jwt.InvalidTokenError as e:
        claim_info['error'] = func.HttpResponse(f"Invalid token: {e}", status_code=401)
    
    return claim_info

############################
#---- Stream Functions ----#
############################

@app.route(route="chat/negotiate", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def chat_negotiate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received chat token negotiation request')

    username = None
    group = req.params.get('recipeId')

    if not group:
        logging.info('Missing recipe ID')
        return func.HttpResponse("Missing recipe ID from chat negotiation", status_code=400)

    claim_info = validate_token(req)
    if (claim_info.get('claims') != None):
        username = claim_info.get('claims').get('name')
    else:
        logging.info("Token not found, treating as a guest user")

    roles=[]

    if username:
        roles.append(f"webpubsub.sendToGroup.{group}")
    else:
        username = group

    token = CHAT_PUBSUB_SERVICE.get_client_access_token(user_id=username, groups=[group], roles=roles)
    
    response_body = json.dumps({'url': token['url']})
    logging.info('Successful chat negotiation')
    return func.HttpResponse(response_body, status_code=200)

@app.route(route="stream/{recipeId}/start", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.POST])
def start_stream(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received stream start request')

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')

    recipe_id = req.route_params.get('recipeId')

    stream_data = stream_container.read_item(recipe_id, partition_key=recipe_id)

    if (stream_data.get('user_id') != user_id):
        logging.info("Sender is not the creator of the recipe")
        return func.HttpResponse("Unauthorized", status_code=401)

    response = streaming.start_stream(recipe_id)

    if (response.streaming_state == "STOPPED"):
        return func.HttpResponse("Error while starting stream", status_code=500)
    else:
        stream_data['live_status'] = streaming.LIVE
        stream_container.upsert_item(stream_data)
        return func.HttpResponse("Livestream successfully started", status_code=200)

@app.route(route="stream/{recipeId}/end", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.POST])
def end_stream(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received stream start request')

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')

    recipe_id = req.route_params.get('recipeId')

    stream_data = stream_container.read_item(recipe_id, partition_key=recipe_id)

    if (stream_data.get('user_id') != user_id):
        logging.info("Sender is not the creator of the recipe")
        return func.HttpResponse("Unauthorized", status_code=401)

    vod_url = streaming.save_vod(recipe_id)
    response = streaming.stop_stream(recipe_id)

    if (response.streaming_state == "STOPPED"):
        stream_data['stream_url'] = vod_url
        stream_data['live_status'] = streaming.VOD
        stream_data['start_time'] = time.time()
        stream_container.upsert_item(stream_data)
        return func.HttpResponse("Livestream successfully ended", status_code=200)
    else:
        return func.HttpResponse("Error while ending livestream", status_code=500)
    
@app.route(route="stream/{recipeId}/steps/next", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.POST])
def next_step(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received next step request')

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')

    recipe_id = req.route_params.get('recipeId')

    stream_data = stream_container.read_item(recipe_id, partition_key=recipe_id)

    if (stream_data.get('user_id') != user_id):
        logging.info("Sender is not the creator of the recipe")
        return func.HttpResponse("Unauthorized", status_code=401)
    
    body = req.get_json()
    step_id = body.get('id')
    time = body.get('time')

    stream_data['step_timings'][step_id] = time
    stream_container.upsert_item(stream_data)

    step_data = {"type": messages.STEP, "content": {"id": step_id, "time": time}}

    CHAT_PUBSUB_SERVICE.send_to_group(group=recipe_id, message=step_data, content_type="application/json")

    return func.HttpResponse("Successfully stepped", status_code=201)

@app.route(route="streams", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_streams_info(req: func.HttpRequest) -> func.HttpResponse:
    try:
        stream_query = """
        SELECT c.id, c.stream_url, c.live_status
        FROM Streams c
        """
        stream_items = list(stream_container.query_items(
            query=stream_query,
            enable_cross_partition_query=True
        ))

        stream_ids = [s["id"] for s in stream_items]
        
        id_list = "', '".join(stream_ids)
        recipe_query = f"""
        SELECT c.id, c.image, c.title, c.tags
        FROM UploadedRecipes c
        WHERE c.id IN ('{id_list}')
        """
        recipe_items = list(recipe_container.query_items(
            query=recipe_query,
            enable_cross_partition_query=True
        ))

        recipe_map = {r["id"]: r for r in recipe_items}

        # Merge Streams & Recipes
        combined_list = []
        for s in stream_items:
            rid = s["id"]
            recipe = recipe_map.get(rid, {})
            combined_list.append({
                "id": rid,
                "stream_url": s.get("stream_url", ""),
                "live_status": s.get("live_status", 3), # 0: Upcoming, 1: Live, 2: On-demand
                "image": recipe.get("image", ""),
                "title": recipe.get("title", ""),
                "tags": recipe.get("tags", [])
            })

        response_body = json.dumps(combined_list)
        return func.HttpResponse(response_body, status_code=200)

    except Exception as e:
        logging.error(f"Error retrieving streams: {str(e)}")
        return func.HttpResponse("Error retrieving streams data", status_code=500)
    
############################
#---- Recipe Functions ----#
############################

@app.route(route="recipe/create", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.POST])
def create_recipe(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received recipe create request')

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')
    
    info = req.get_json()
    title = info.get('title')
    steps = info.get('steps')
    shopping = info.get('shopping')
    date = info.get('scheduledDate')
    image = info.get('imageUrl')
    cookTime = info.get('cookTime')
    tags = info.get('tags')
    servings = info.get('servings')
    
    recipe_dict = {
        "user_id": user_id,
        "title": title,
        "steps": steps,
        "shopping": shopping,
        "date": date,
        "image": image,
        "cookTime" : cookTime,
        "tags": tags,
        "servings": servings
    }
    
    cosmos_dict = recipe_container.create_item(body=recipe_dict, enable_automatic_id_generation=True)
    recipe_id = cosmos_dict.get('id')

    logging.info(f"Auto-generated recipe ID: {recipe_id}")

    channel_info = streaming.create_recipe_channel(recipe_id)
    input_url = channel_info.get('input_url')
    stream_dict = {
        "id": recipe_id,
        "user_id": user_id,
        "stream_url": f"https://storage.googleapis.com/livefeed-bucket/outputs/output-{recipe_id}/manifest.m3u8",
        "step_timings": {},
        "input_url": input_url,
        "live_status": streaming.AWAITING_LIVE
    }

    stream_container.create_item(body=stream_dict, enable_automatic_id_generation=False)

    return func.HttpResponse(json.dumps({"recipe_created": "OK"}), status_code=201, mimetype="application/json")

@app.route(route="recipe/get", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_recipe_list(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Get Recipe')

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')
    
    logging.info(f"Identified sender as {user_id}")
    
    try:
    
        query = f"SELECT * FROM c WHERE c.user_id = '{ user_id}'"
        
        items = list(recipe_container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))
        
        if not items:
            return func.HttpResponse(
                "Recipe not found",
                status_code=404
            )
            
        response_body = json.dumps(items)
        logging.info('Successful recipe retrieval }')
        logging.info(items)
        return func.HttpResponse(response_body, status_code=200)
        
    except Exception as e:
        logging.error(f'Error retrieving recipe: {str(e)}')
        
   
   
    return func.HttpResponse(response_body, status_code=200)

@app.route(route="recipe/update", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.PUT])
@app.generic_output_binding(
    arg_name="signalROutput",
    type="signalR",
    hubName="serverless",
    connectionStringSetting="AzureSignalRConnectionString"
)
def update_recipe(req: func.HttpRequest, signalROutput) -> func.HttpResponse:
    logging.info('Update Recipe')

    auth_header = req.headers.get("Authorization")

    if not auth_header.startswith("Bearer "):
        return func.HttpResponse("User ID required", status_code=401)

    token = auth_header.split(" ")[1]
    
    claim_info = validate_token(token)
    claims = claim_info.get('claims')
    if (not claims): return claim_info.get('error')

    user_id = claims.get('sub')
    logging.info(f"Identified sender as {user_id}")
    
    try:
        info = req.get_json()
        logging.info(info)
        id = info.get('id')
      
        recipe_container.read_item()

        query = f"SELECT * FROM c WHERE c.id = '{id}'"
        items = list(recipe_container.query_items(query=query, enable_cross_partition_query=True))
        logging.info(items)
        
        if not items:
            return func.HttpResponse("Recipe not found", status_code=404)


        recipe_container.replace_item(item=id, body=req.get_json())

        signalROutput.set(json.dumps({
            "userId": user_id,
            "target": "eventNotification",
            "arguments": ["Successfully updated recipe"]
        }))

        return func.HttpResponse(json.dumps({"recipe_updated": "OK"}), status_code=200, mimetype="application/json")

    except Exception as e:
        logging.error(f'Error updating recipe: {str(e)}')
   
    return func.HttpResponse("Error updating recipe", status_code=500)

@app.route(route="recipe/delete", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.POST])
def delete_recipe(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Delete Recipe')
    
    try:
        info = req.get_json()
        logging.info(info)
        user_id = info.get('user_id')
        id = info.get('id')


        query = f"SELECT * FROM c WHERE c.id = '{id}'"
        items = list(recipe_container.query_items(query=query, enable_cross_partition_query=True))
        logging.info(items)
        

        recipe_container.delete_item(item=id,partition_key=user_id)
        streaming.delete_vod(id)
        stream_container.delete_item(id, partition_key=id)
        return func.HttpResponse(json.dumps({"recipe_updated": "OK"}), status_code=200, mimetype="application/json")

    except Exception as e:
        logging.error(f'Error updating recipe: {str(e)}')
   
    return func.HttpResponse("Error updating recipe", status_code=500)

@app.route(route="recipe/display", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def display_recipe(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Display Recipe')
    
    try:
        info = req.params
        logging.info(info)
        id = info.get('id')
      

        query = f"SELECT * FROM c WHERE c.id = '{id}'"
        items = list(recipe_container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
            
        if not items:
                return func.HttpResponse(
                    "Recipe not found",
                    status_code=404
                )
                
        response_body = json.dumps(items[0])
        logging.info('Successful recipe retrieval }')
        logging.info(items)
        return func.HttpResponse(response_body, status_code=200)
    except Exception as e:
        logging.error(f'Error updating recipe: {str(e)}')
   
    return func.HttpResponse("Error updating recipe", status_code=500)

def get_stream_from_db(recipe_id, user_id):
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

    stream_dict['input'] = stream_data.get('input_url')

    live_status = stream_data.get('live_status')
    if live_status is not None:
        stream_dict['liveStatus'] = live_status
    # for testing:
    else:
        stream_dict['liveStatus'] = 0

    return stream_dict

@app.route(route='stream/{recipeId}', auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_stream_info(req: func.HttpRequest) -> func.HttpResponse:
    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')

    recipe_id = req.route_params.get('recipeId')
    stream_dict = get_stream_from_db(recipe_id, user_id)

    return func.HttpResponse(json.dumps(stream_dict), mimetype='application/json', status_code=200)

@app.route(route='vod/{recipeId}', auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_vod_info(req: func.HttpRequest) -> func.HttpResponse:
    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')

    recipe_id = req.route_params.get('recipeId')
    stream_dict = get_stream_from_db(recipe_id, user_id)

    return func.HttpResponse(json.dumps(stream_dict), mimetype='application/json', status_code=200)
    
@app.route(route="recipe/upcoming", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_upcoming_recipes(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Get All "Upcoming" Recipes')

    try:
        # Get all future upcoming recipes
        query = f"""
        SELECT * 
        FROM UploadedRecipes c 
        WHERE c.date > '{current_date}'
        """
        items = list(recipe_container.query_items(
            query=query,
            enable_cross_partition_query=True
        ))

        if not items:
            return func.HttpResponse(
                'No "Upcoming" recipes found',
                status_code=404
            )

        response_body = json.dumps(items)
        logging.info('Successfully retrieved all "Upcoming" recipes')
        return func.HttpResponse(response_body, status_code=200)
        
    except Exception as e:
        logging.error(f'Error retrieving "Upcoming" recipes: {str(e)}')
        return func.HttpResponse('Error retrieving "Upcoming" recipes', status_code=500)

############################
#---- User Functions ----#
############################
@app.route(route="settings/user/update", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.PATCH])
def update_user_profile(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        user_id = req_body.get('id')
        display_name = req_body.get('displayName')
        given_name = req_body.get('givenName')
        family_name = req_body.get('familyName')
        
        if not user_id or not display_name or not given_name or not family_name:
            return func.HttpResponse(
                json.dumps({"message": "Missing fields"}),
                mimetype="application/json",
                status_code=200
            )
        token = get_web_access_token()
        url = f"https://graph.microsoft.com/v1.0/users/{user_id}"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        body = {
            "displayName": display_name,
            "givenName": given_name,
            "surname": family_name
        }
        
        response = requests.patch(url, headers=headers, json=body)
        
        if response.status_code == 204:
            logging.info(f"User {user_id} updated successfully")
            return func.HttpResponse(
                json.dumps({"message": "User updated successfully."}),
                mimetype="application/json",
                status_code=200
            )
        
        logging.error(f"Failed to update user: {response.status_code}, {response.text}")
        return func.HttpResponse(
            json.dumps({"message": f"Failed to update user. Error: {response.text}"}),
            mimetype="application/json",
            status_code=response.status_code
        )

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
    
@app.route(route="settings/preferences", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.PATCH])
def update_user_preferences(req: func.HttpRequest) -> func.HttpResponse:
    logging.info(f"Request to update user preferences received")

    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')

    try:
        body = req.get_json()
        try:
            preferences = prefs_container.read_item(item=user_id, partition_key=user_id)
        except CosmosResourceNotFoundError:
            logging.info(f"No existing preferences for {user_id}, creating new record.")
            preferences = {"id": user_id, "user_id": user_id, "tags": [], "notifications": True}
        if 'tags' in body:
            preferences['tags'] = body['tags']
        if 'notifications' in body:
            preferences['notifications'] = body['notifications']

        prefs_container.upsert_item(preferences)
        return func.HttpResponse(
            json.dumps({"message": "Preferences updated successfully."}),
            status_code=200,
            mimetype="application/json"
        )
    except ValueError:
        return func.HttpResponse("Invalid JSON format", status_code=400)
    except Exception as e:
        logging.error(f"Failed to update preferences: {str(e)}")
        return func.HttpResponse("Failed to update preferences", status_code=500)

@app.route(route="settings/preferences", auth_level=func.AuthLevel.ANONYMOUS, methods=[func.HttpMethod.GET])
def get_user_preferences(req: func.HttpRequest) -> func.HttpResponse:
    claim_info = validate_token(req)
    user_id = None
    if (claim_info.get('claims') != None):
        user_id = claim_info.get('claims').get('sub')
    else:
        return claim_info.get('error')
    try:
        preferences = prefs_container.read_item(item=user_id, partition_key=user_id)
        return func.HttpResponse(
            json.dumps(preferences),
            status_code=200,
            mimetype="application/json"
        )
    except CosmosResourceNotFoundError:
        return func.HttpResponse(json.dumps({"tags": [], "notifications": True}), status_code=200)
    except Exception as e:
        logging.error(f"Failed to retrieve preferences for user {user_id}: {str(e)}")
        return func.HttpResponse(f"Failed to retrieve preferences: {str(e)}", status_code=500)


@app.route(route="notifications/negotiate", auth_level=func.AuthLevel.ANONYMOUS, methods=["POST"])
@app.generic_input_binding(arg_name="connectionInfo", type="signalRConnectionInfo", hubName="serverless", connectionStringSetting="AzureSignalRConnectionString", userId="{headers.x-ms-signalr-userid}")
def signalr_negotiate(req: func.HttpRequest, connectionInfo) -> func.HttpResponse:
    logging.info("SignalR negotiation request")
    auth_header = req.headers.get("Authorization")

    if not auth_header.startswith("Bearer "):
        return func.HttpResponse("User ID required", status_code=401)

    token = auth_header.split(" ")[1]
    
    claim_info = validate_token(token)
    claims = claim_info.get('claims')
    if (not claims): return claim_info.get('error')

    user_id = claims.get('sub')
    logging.info(f"Identified sender as {user_id}")

    if user_id != req.headers.get('x-ms-signalr-userid'):
        return func.HttpResponse("Unauthorized", status_code=401)

    return func.HttpResponse(connectionInfo)