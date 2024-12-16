import azure.functions as func
import os
import logging
import datetime
import json
from shared_code import streaming

app = func.FunctionApp()

print(streaming.get_channel('livefeed-443712', 'europe-west2', 'livefeed-test-channel'))

@app.route(route="stream/start", auth_level=func.AuthLevel.FUNCTION, methods=[func.HttpMethod.POST])
def start_stream(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )