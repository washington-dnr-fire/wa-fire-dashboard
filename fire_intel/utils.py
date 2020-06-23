# utils.py
from django.conf import settings
import requests

def get_that_egp_token():
    agol_token_url = 'https://egp.nwcg.gov/arcgis/tokens'
    referer = 'http://dnr.wa.gov'
    TOKEN_CREDENTIALS_PAYLOAD = {
        'client': 'referer',
        'f': 'json',
        'referer': referer,
        'username': settings.EGP_USERNAME,
        'password': settings.EGP_PASS_ME_A_WORD,
        'expiration': 60,
    }
    r = requests.post(agol_token_url, params=TOKEN_CREDENTIALS_PAYLOAD)
    return r.json()['token']