import azure.functions as func
import os
import logging
import datetime
import json
from shared_code import streaming
from azure.messaging.webpubsubservice import (
    WebPubSubServiceClient
)

app = func.FunctionApp()

hub_name = 'livefeed'
connection_string = os.environ.get('WebPubSubConnectionString')
service = WebPubSubServiceClient.from_connection_string(connection_string, hub=hub_name)

#print(streaming.get_channel('livefeed-443712', 'europe-west2', 'livefeed-test-channel'))

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

    token = service.get_client_access_token(user_id=id, groups=[group], roles=["webpubsub.sendToGroup." + group])
    
    response_body = json.dumps({'url': token['url']})
    logging.info('Successful chat negotiation')
    return func.HttpResponse(response_body, status_code=200)


# TODO: replace mock with real API
MOCK_STREAM = json.dumps({'name':'Stream 1', 'channel':'channel1', 'group':'channel1', 'recipe': 1, 'shopping': 1})
@app.route(route='live/1', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_live(_: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM, mimetype='application/json')
