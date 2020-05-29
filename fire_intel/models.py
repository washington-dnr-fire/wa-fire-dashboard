from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import requests
from django.conf import settings


class DateTimeStampMixin(models.Model):
    
    date_of_report = models.DateTimeField(help_text="REMEMBER - the latest date's Fire Intel is always shown in the application by data type. The date should always be 'today' and 'now', but if you need to update values be sure to update the date too", blank=False)
    
    class Meta:
        abstract = True


# IntelAbstractBaseMixin Model - contains inherited data fields for each region
class IntelAbstractBaseMixin(DateTimeStampMixin):

    new_initial_attack = models.SmallIntegerField("New Initial Attack Fire Counts", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    new_ia_acres = models.DecimalField("New Initial Attack Acres", help_text="Value is rounded to two decimals places", blank=False,
                                                     max_digits=8, decimal_places=2)
    region_large_fires = models.IntegerField("Current Number of Large Fires in Region", blank=False, help_text="How many WA-based large fires are there currently in your region")
    
    total_responses = models.IntegerField("Total Responses in Region", help_text="To-date value, how many responses are reported in EIRS?", blank=False)
    total_dnr_fires = models.IntegerField("Total DNR Fires in Region to-date", blank=False, help_text="To-date value, how many DNR fires are reported in EIRS?")
    
    total_response_acres = models.DecimalField("Total Response Acres in Region", help_text="Value is rounded to two decimals places", blank=False,
                                                     max_digits=10, decimal_places=2)
    total_dnr_acres = models.DecimalField("Total DNR Acres Burned in Region", help_text="To-date value comes from EIRS data, also value is rounded to two decimals places", blank=False,
                                                     max_digits=10, decimal_places=2)

    committed_engines = models.SmallIntegerField("In Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    committed_crews = models.SmallIntegerField("In Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])
    available_engines = models.SmallIntegerField("Out of Region Engines", blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    available_crews = models.SmallIntegerField("Out of Region Crews", blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])

    # def newest_record(self):
    #     self.objects.latest("date_of_report")

    def __str__(self):
        return "Intel Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))

    class Meta:
        abstract = True
    

# OverviewIntel Model
class OverviewIntelReport(DateTimeStampMixin):
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

    preparedness_level_national = models.SmallIntegerField("National Preparedness Level", choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                           help_text="What is the national preparedness level? (out of 5)")
    preparedness_level_nw = models.SmallIntegerField("Northwest Preparedness Level", choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                     help_text="What is the current NW GACC preparedness level? (out of 5)")
    type_1_teams_assigned = models.SmallIntegerField("Type 1 Teams Assigned", choices=sorted(NW_TYPE_1_TEAMS), blank=False,
                                                     help_text="How many NW Type 1 teams are currently assigned?")
    type_2_teams_assigned = models.SmallIntegerField("Type 2 Teams Assigned", choices=sorted(NW_TYPE_2_TEAMS), blank=False,
                                                     help_text="How many NW Type 2 teams are currently assigned?")

    # fire statistics
    westside_dnr_responses_count = models.IntegerField("YTD Westside DNR Responses", blank=False)
    westside_dnr_fire_count = models.IntegerField("YTD Westside DNR Fires", blank=False)
    westside_dnr_fire_acres = models.IntegerField("YTD Westside DNR Fire Acres", blank=False)
    westside_all_fire_acres = models.IntegerField("YTD Westside All Acres", blank=False)

    eastside_dnr_responses_count = models.IntegerField("YTD Eastside DNR Responses", blank=False)
    eastside_dnr_fire_count = models.IntegerField("YTD Eastside DNR Fires", blank=False)
    eastside_dnr_fire_acres = models.IntegerField("YTD Eastside DNR Fire Acres", blank=False)
    eastside_all_fire_acres = models.IntegerField("YTD Eastside All Acres", blank=False)

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

    class Meta:
        verbose_name = 'Overview Intel Report'
        verbose_name_plural = 'Overview Intel Reports'

    def __str__(self):
        return "Intel Overview Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))
    

# Aviation Intel Report
class AviationIntelReport(DateTimeStampMixin):

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

    class Meta:
        verbose_name = 'Aviation Intel Report'
        verbose_name_plural = 'Aviation Intel Reports'

    def __str__(self):
        return "Aviation Intel Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))


# Northeast Intel Report 
class NortheastRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="NE", editable=False)

    class Meta:
        verbose_name = 'NE Region Intel Report'
        verbose_name_plural = 'NE Region Intel Reports'


# Southeast Intel Report
class SoutheastRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="SE", editable=False)

    class Meta:
        verbose_name = 'SE Region Intel Report'
        verbose_name_plural = 'SE Region Intel Reports'


# Northwest Intel Report
class NorthwestRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="NW", editable=False)

    class Meta:
        verbose_name = 'NW Region Intel Report'
        verbose_name_plural = 'NW Region Intel Reports'


# South Puget Sound Intel Report
class SouthPugetSoundRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="SPS", editable=False)

    class Meta:
        verbose_name = 'SPS Region Intel Report'
        verbose_name_plural = 'SPS Region Intel Reports'


# Pacific Cascade Intel Report
class PacificCascadeRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="PC", editable=False)

    class Meta:
        verbose_name = 'PC Region Intel Report'
        verbose_name_plural = 'PC Region Intel Reports'


# Olympic Intel Report
class OlympicRegionIntelReport(IntelAbstractBaseMixin):
    dnr_region = models.CharField(verbose_name="DNR Region Name", max_length=3, default="OLY", editable=False)

    class Meta:
        verbose_name = 'OLY Region Intel Report'
        verbose_name_plural = 'OLY Region Intel Reports'
