from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import requests
from django.conf import settings


# Intel Model
class IntelReport(models.Model):
    PREPAREDNESS_LEVELS = {
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    }

    NW_TYPE_1_TEAMS = {
        (0, 0),
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
    }

    NW_TYPE_2_TEAMS = {
        (0, 0),
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5),
        (6, 6),
        (7, 7),
    }

    date_of_report = models.DateTimeField(help_text="REMEMBER - the latest date's Fire Intel is always shown in the application. The date should always be 'today' and 'now', but if you need to update values be sure to update the date too", blank=False)

    preparedness_level_national = models.SmallIntegerField("National Preparedness Level", choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                           help_text="What is the national preparedness level? (out of 5)")
    preparedness_level_nw = models.SmallIntegerField("Northwest Preparedness Level", choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                     help_text="What is the current NW GACC preparedness level? (out of 5)")
    type_1_teams_assigned = models.SmallIntegerField("Type 1 Teams Assigned", choices=sorted(NW_TYPE_1_TEAMS), blank=False,
                                                     help_text="How many NW Type 1 teams are currently assigned?")
    type_2_teams_assigned = models.SmallIntegerField("Type 2 Teams Assigned", choices=sorted(NW_TYPE_2_TEAMS), blank=False,
                                                     help_text="How many NW Type 2 teams are currently assigned?")
    wa_large_fires = models.IntegerField("Washington Large Fires", blank=False, help_text="How many WA-based large fires are there currently?")
    dnr_ia_fires = models.IntegerField("DNR IA Fires", blank=False, help_text="How many DNR-based IA fires are there currently?")

    oly_committed_engines = models.SmallIntegerField("OLS In Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_committed_crews = models.SmallIntegerField("OLS In Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_available_engines = models.SmallIntegerField("OLS Out of Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_available_crews = models.SmallIntegerField("OLS Out of Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])

    nw_committed_engines = models.SmallIntegerField("NWS In Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_committed_crews = models.SmallIntegerField("NWS In Region Crews", blank=False, default=0,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_available_engines = models.SmallIntegerField("NWS Out of Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_available_crews = models.SmallIntegerField("NWS Out of Region Crews", blank=False, default=0,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    sps_committed_engines = models.SmallIntegerField("SPS In Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_committed_crews = models.SmallIntegerField("SPS In Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_available_engines = models.SmallIntegerField("SPS Out of Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_available_crews = models.SmallIntegerField("SPS Out of Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])

    pc_committed_engines = models.SmallIntegerField("PCS In Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_committed_crews = models.SmallIntegerField("PCS In Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_available_engines = models.SmallIntegerField("PCS Out of Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_available_crews = models.SmallIntegerField("PCS Out of Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    se_committed_engines = models.SmallIntegerField("SES In Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_committed_crews = models.SmallIntegerField("SES In Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_available_engines = models.SmallIntegerField("SES Out of Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_available_crews = models.SmallIntegerField("SES Out of Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    ne_committed_engines = models.SmallIntegerField("NES In Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_committed_crews = models.SmallIntegerField("NES In Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_available_engines = models.SmallIntegerField("NES Out of Region Engines", blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_available_crews = models.SmallIntegerField("NES Out of Region Crews", blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    westside_rotors = models.SmallIntegerField("Westside Helicopters", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    westside_firebosses = models.SmallIntegerField("Westside SEATs", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(100)])
    westside_atgs = models.SmallIntegerField("Westside ATGS", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    eastside_rotors = models.SmallIntegerField("Eastside Helicopters", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    eastside_firebosses = models.SmallIntegerField("Eastside SEATs", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(100)])
    eastside_atgs = models.SmallIntegerField("Eastside ATGS", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    in_region_vlat = models.SmallIntegerField("In Region VLATs", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    in_region_lat = models.SmallIntegerField("In Region LATs", blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    # fire statistics
    westside_dnr_responses_count = models.IntegerField("YTD Westside DNR Responses", blank=False)
    westside_dnr_fire_count = models.IntegerField("YTD Westside DNR Fires", blank=False)
    westside_dnr_fire_acres = models.IntegerField("YTD Westside DNR Fire Acres", blank=False)
    westside_all_fire_acres = models.IntegerField("YTD Westside All Acres", blank=False)

    eastside_dnr_responses_count = models.IntegerField("YTD Eastside DNR Responses", blank=False)
    eastside_dnr_fire_count = models.IntegerField("YTD Eastside DNR Fires", blank=False)
    eastside_dnr_fire_acres = models.IntegerField("YTD Eastside DNR Fire Acres", blank=False)
    eastside_all_fire_acres = models.IntegerField("YTD Eastside All Acres", blank=False)

    def __str__(self):
        return "Intel Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))

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


# Aviation Log Model
class AviationLog(models.Model):
    updated_by = models.CharField(max_length=50, default="Adam Jones", blank=False)
    notes = models.TextField(max_length=500, blank=False)
    date = models.DateTimeField(auto_now=True)

class AviationDoc(models.Model):
    file_name = models.CharField(max_length=50, blank=False)
    file_upload = models.FileField(upload_to='aviation_docs/')
    short_description = models.CharField(max_length=100, blank=False) 
    date = models.DateTimeField(auto_now=True)
    is_cost_sheet = models.BooleanField(default=False, help_text="Is this uploaded document a Cost Sheet?")
    uploaded_by = models.CharField(max_length=50, default="Adam Jones", blank=False)
    
