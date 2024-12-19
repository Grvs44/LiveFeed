import msal
import requests
import json
import os

from azure.identity import ClientSecretCredential,EnvironmentCredential

def create_credentials():

    credentials = EnvironmentCredential(

        client_id=os.environ.get("AzureB2CAppID"),

        client_secret="SRR8Q~blYEKS6~bTE3qku-tylIu6b3dwGYJluc.H",

        tenant_id=os.environ.get("AzureB2CTenantID"),

        authority='https://login.microsoftonline.com/'

    )



    return credentials


app = msal.PublicClientApplication(
    os.environ.get("AzureB2CAppID"),
    authority=ClientSecretCredential(create_credentials())
    client_credential=None
)

scopes = ["https://graph.microsoft.com/.default"]

result = app.acquire_token_interactive(scopes=scopes)

if "access_token" in result:
    access_token = result["access_token"]
else:
    error_message = result.get("error_description", "No Access Token found")
    raise Exception(error_message)

headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

response = requests.get(
    url="https://graph.microsoft.com/v1.0/me",
    headers=headers
)

if response.status_code == 200:
    user_details = response.json()
    print(json.dumps(user_details, indent=4))
else:
    raise Exception("Failed to fetch user details from Microsoft Graph API")