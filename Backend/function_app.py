import azure.functions as func
import os
import logging
import datetime
import json
import jwt
from shared_code import streaming
from azure.messaging.webpubsubservice import (
    WebPubSubServiceClient
)
from jwt import PyJWKClient

app = func.FunctionApp()

HUB_NAME = 'livefeed'
PUBSUB_CONNECTION_STRING = os.environ.get('WebPubSubConnectionString')
PUBSUB_SERVICE = WebPubSubServiceClient.from_connection_string(PUBSUB_CONNECTION_STRING, hub=HUB_NAME)

CLIENT_ID = os.environ.get("AzureB2CAppID")
TENANT_ID = os.environ.get("AzureB2CTenantID")
TENANT_NAME = os.environ.get("AzureB2CTenantName")
POLICY_NAME = os.environ.get("AzureB2CPolicyName")

ISSUER = f"https://{TENANT_NAME}.b2clogin.com/{TENANT_ID}/v2.0/"
JWKS_URL = f"https://{TENANT_NAME}.b2clogin.com/{TENANT_NAME}.onmicrosoft.com/discovery/v2.0/keys?p={POLICY_NAME}"

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

    token = PUBSUB_SERVICE.get_client_access_token(user_id=username, groups=[group], roles=roles)
    
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

    if (response.get('streaming_state') == "STOPPED"):
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

    response = streaming.stop_stream(recipe_id)

    if (response.get('streaming_state') == "STOPPED"):
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

    recipe_id = "UNIQUE_ID" # Replace with whatever ID is generated for recipe, probably from cosmos; will be used to start streams

    channel_info = streaming.create_recipe_channel(recipe_id)

# TODO: replace mock with real API
from pathlib import Path
MOCK_STREAM = lambda: (Path(__file__).parent / 'mock_stream.json').read_text()

@app.route(route='stream/{recipeId}', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_live(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')

@app.route(route='vod/{recipeId}', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_vod(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')
