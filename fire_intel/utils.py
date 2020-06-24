# utils.py
from django.conf import settings
from django.core.cache import cache
import requests

def get_that_egp_token():
    if cache.get("agol_auth_token"):
        token = cache.get("agol_auth_token")
        return token
    else:
        agol_token_url = 'https://egp.nwcg.gov/arcgis/tokens'
        referer = 'http://dnr.wa.gov'
        TOKEN_CREDENTIALS_PAYLOAD = {
            'client': 'referer',
            'f': 'json',
            'referer': referer,
            'username': settings.EGP_USERNAME,
            'password': settings.EGP_PASS_ME_A_WORD,
            'expiration': 1440,
        }
        r = requests.post(agol_token_url, params=TOKEN_CREDENTIALS_PAYLOAD)
        token = r.json()['token']
        cache.set("agol_auth_token", token, 60*720)
        return token