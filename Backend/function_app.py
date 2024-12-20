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

@app.route(route="chat/negotiate", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def chat_negotiate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Received chat token negotiation request')

    id = req.params.get('userId')
    group = req.params.get('channelId')

    if not id:
        logging.info('Missing user ID')
        return func.HttpResponse("Missing user ID from chat negotiation", status_code=400)

    if not group:
        logging.info('Missing channel ID')
        return func.HttpResponse("Missing channel ID from chat negotiation", status_code=400)

    token = PUBSUB_SERVICE.get_client_access_token(user_id=id, groups=[group], roles=["webpubsub.sendToGroup." + group])
    
    response_body = json.dumps({'url': token['url']})
    logging.info('Successful chat negotiation')
    return func.HttpResponse(response_body, status_code=200)

@app.route(route="stream/start", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def start_stream(req: func.HttpRequest) -> func.HttpResponse:
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

    logging.info("Identified sender as " + claims.get('sub'))
    return func.HttpResponse("Great success!")

# TODO: replace mock with real API
from pathlib import Path
MOCK_STREAM = lambda: (Path(__file__).parent / 'mock_stream.json').read_text()
@app.route(route='live/1', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_live(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')
@app.route(route='vod/1', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_vod(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')
