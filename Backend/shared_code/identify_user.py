import json
import jwt
import requests

token="eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MzQ2NTg3NDEsIm5iZiI6MTczNDY1NTE0MSwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9saXZlZmVlZGxvZy5iMmNsb2dpbi5jb20vMjU4N2RiYmItZGZjNi00Mzg1LTk4OTAtNjU0M2MxNDZmY2FiL3YyLjAvIiwic3ViIjoiM2ZjMzdiMzYtZGFmMS00ODNmLTg1ODktYjA4OGQ4MzEwYWQxIiwiYXVkIjoiY2Q3MDM4OTQtZDY0ZS00Mjk4LTgzOWYtZTI3Nzg5YjMzMWFjIiwibm9uY2UiOiIwMTkzZTE4MC1lMThmLTczYTYtYjcxZC1jNDU5NmM3Nzk2MWUiLCJpYXQiOjE3MzQ2NTUxNDEsImF1dGhfdGltZSI6MTczNDY1NTE0MSwiY291bnRyeSI6IlVuaXRlZCBLaW5nZG9tIiwibmFtZSI6Ik15c3RhcmllIiwiZ2l2ZW5fbmFtZSI6Ik1haGRpIiwiZmFtaWx5X25hbWUiOiJDaG93ZGh1cnkiLCJ0ZnAiOiJCMkNfMV9zaWdudXBzaWduaW4xIn0.rzvnxwOPSQja_eghGaFwT4t9C2FLzDZ2bpsnYKBhh-zUoZMIPt_i_vtGluhA-gcZwk5HLPgoRxisEyimDYE-_cOoitDiBov4iX8P7j9fOsJeHeQKSG5wf0IGDmTfL8S6IAV7VyXVnVN8WeXhGl2p1S2h5MTD-qRjqDi25MFvXVRCYF6TmZOtHb-chi1gUQNnaYOAKhr9VND0Omsi1tBLigOS1k4ItDjFKU4FTgoVTVrWn0x01THsnyB71KlGtD9oz48gE8JgXRK352zqYReY6aEn6ytoZnZ9Yg7HAAgZpgKJoAHtWoOILAa24d633OGOFfeVtbVoKJ5sQbr2EKKrQg"
client_id = "aae8f9ef-5c79-476b-9101-a68e0b0ed9fb"
tenant_id = "2587dbbb-dfc6-4385-9890-6543c146fcab"

response = requests.get("https://livefeedlog.b2clogin.com/livefeedlog.onmicrosoft.com/B2C_1_signupsignin1/v2.0/.well-known/openid-configuration")

uri = response.json().get('jwks_uri')

print(uri)

response = requests.get(uri)

jwks = response.json()

#for JWKS that contain multiple JWK
public_keys = {}
for jwk in jwks['keys']:
    kid = jwk['kid']
    public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

kid = jwt.get_unverified_header(token)['kid']
key = public_keys.get(kid)

print(kid)

print(public_keys.keys())

print(key)

payload = jwt.decode(token, key=key, algorithms=['RS256'])
"""
from jwt import PyJWKClient


def token_is_valid(tenant_id, audience, token):
    jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
    issuer_url = f"https://login.microsoftonline.com/{tenant_id}/v2.0"
    jwks_client = PyJWKClient(
        jwks_url,
    )
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        verify=True,
        algorithms=["RS256"],
        audience=audience,
        issuer=issuer_url,
    )
    

import requests
response = requests.get("https://login.microsoftonline.com/common/discovery/keys")
keys = response.json()['keys']

# Format keys as PEM
from cryptography.hazmat.primitives import serialization
rsa_pem_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(public_key))
rsa_pem_key_bytes = rsa_pem_key.public_bytes(
    encoding=serialization.Encoding.PEM, 
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# Get algorithm from token header
alg = jwt.get_unverified_header(token)['alg']

# Decode token
jwt.decode(
    token,
    key=rsa_pem_key_bytes,
    algorithms=[alg],
    verify=True,
    audience=[your-client-id],
    options={"verify_signature": True}
)"""