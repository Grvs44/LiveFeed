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

@app.route(route="negotiate", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def negotiate(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    id = req.params.get('userId')
    group = req.params.get('channelId')

    if not id:
        return func.HttpResponse("Missing user ID", status_code=400)

    if not group:
        return func.HttpResponse("Missing channel ID", status_code=400)

    token = service.get_client_access_token(user_id=id, groups=[group])
    
    response_body = json.dumps({'url': token['url']})
    return func.HttpResponse(response_body, status_code=200)