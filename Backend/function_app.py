import azure.functions as func
from azure.cosmos import CosmosClient
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

client = CosmosClient("https://livefeed-storage.documents.azure.com:443/", "RMcJvdRXCSCk60vX8ga7uAdnfl2yKW1nGBDf0EKcHc8NtdwKs72NAq2mDtUk8hW6NWwN3RnXMUFxACDbWLE70A==")
database= client.get_database_client('Recipes')
container = database.get_container_client('UploadedRecipes')

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

@app.route(route="recipe/upload", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def upload_recipe(req: func.HttpRequest) -> func.HttpResponse:
    info = req.get_json()
    title = info.get('title')
    steps = info.get('steps')
    shoppingList = info.get('shoppingList')
    date = info.get('scheduledDate')
    
    recipes = {
        "title": title,
        "steps": steps,
        "shoppingList": shoppingList,
        "date": date
    }
    
    container.create_item(body=recipes, enable_automatic_id_generation=True)
    return func.HttpResponse(json.dumps({"recipe_created": "OK"}), status_code=201, mimetype="application/json")


# TODO: replace mock with real API
from pathlib import Path
MOCK_STREAM = lambda: (Path(__file__).parent / 'mock_stream.json').read_text()
@app.route(route='live/1', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_live(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')
@app.route(route='vod/1', auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.GET])
def mock_vod(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse(MOCK_STREAM(), mimetype='application/json')
