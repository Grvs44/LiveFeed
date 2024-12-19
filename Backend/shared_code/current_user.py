import os
import requests
import json
import msal

client_id = "aae8f9ef-5c79-476b-9101-a68e0b0ed9fb"
client_secret = "SRR8Q~blYEKS6~bTE3qku-tylIu6b3dwGYJluc.H"
tenant_id = "2587dbbb-dfc6-4385-9890-6543c146fcab"

app = msal.PublicClientApplication(
    client_id=client_id, 
    authority=f"https://login.microsoftonline.com/{tenant_id}",
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