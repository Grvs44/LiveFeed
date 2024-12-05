import azure.functions as func
import datetime
import json
from shared_code import streaming

print(streaming.get_channel('livefeed-443712', 'europe-west2', 'livefeed-test-channel'))