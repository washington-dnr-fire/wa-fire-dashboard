from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
import requests
from django.conf import settings
import pytz
import datetime

PACIFIC_TZ = pytz.timezone("US/Pacific")


class SpecificRegionQuerySet(models.QuerySet):

    def _get_latest_intel_report(self):
        try:
            return self.latest("date_of_report")
        except:
            return None

    def _get_previous_intel_report(self):
        try:
            return self.order_by("-date_of_report")[1]
        except:
            return None

    def get_24hr_48hr_fire_count_and_acres_dict(self):
        """returns dict of fire count and acres in last 24hrs - the approach
            here is fairly slow and results in 22 hits to the DB and will need to be changed"""
        incomplete_data_flg = False
        intel_dict = {"fire_count_24hr": 0,
                            "fire_acres_24hr": 0,
                            "fire_count_48hr": 0,
                            "fire_acres_48hr": 0}
        try:
            latest_report = self._get_latest_intel_report()
            latest_report_date = latest_report.date_of_report.astimezone(PACIFIC_TZ)
        except AttributeError: # thrown if something doesn't exist
            latest_report = None
        
        try:
            previous_report = self._get_previous_intel_report()
            previous_report_date = previous_report.date_of_report.astimezone(PACIFIC_TZ)
        except AttributeError:
            previous_report = None

        # get now for testing
        now = datetime.datetime.now(tz=PACIFIC_TZ)

        if latest_report:
            if (now-latest_report_date).days == 0:
                intel_dict["fire_count_24hr"] += latest_report.new_initial_attack
                intel_dict["fire_acres_24hr"] += latest_report.new_ia_acres
                intel_dict["fire_count_48hr"] += latest_report.new_initial_attack
                intel_dict["fire_acres_48hr"] += latest_report.new_ia_acres

            if  (now-latest_report_date).days > 0 and (now-latest_report_date).days <= 2:
                intel_dict["fire_count_48hr"] += latest_report.new_initial_attack
                intel_dict["fire_acres_48hr"] += latest_report.new_ia_acres

        if previous_report:
            if (now-previous_report_date).days <= 2:
                intel_dict["fire_count_48hr"] += previous_report.new_initial_attack
                intel_dict["fire_acres_48hr"] += previous_report.new_ia_acres
        
        return intel_dict


class IntelQuerySet(models.QuerySet):

    def get_latest_intel_report(self):
        try:
            return self.latest("date_of_report")
        except:
            return None

    def get_previous_intel_report(self):
        try:
            return self.order_by("-date_of_report")[1]
        except:
            return None

        
class DateTimeStampMixin(models.Model):
    
    date_of_report = models.DateTimeField(help_text="REMEMBER - the latest date's Fire Intel is always shown in the application by data type. The date should always be 'today' and 'now', but if you need to update values be sure to update the date too", blank=False)

    objects = IntelQuerySet.as_manager()

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

    # definte custom QuerySet as manager
    counts = SpecificRegionQuerySet.as_manager()

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
    WA_TYPE_3_TEAMS = {
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
    preparedness_level_dnr = models.SmallIntegerField("DNR Preparedness Level", choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                     help_text="What is the current DNR preparedness level? (out of 5)", default=0)

    type_1_teams_assigned = models.SmallIntegerField("Type 1 Teams Assigned", choices=sorted(NW_TYPE_1_TEAMS), blank=False,
                                                     help_text="How many NW Type 1 teams are currently assigned?")
    type_2_teams_assigned = models.SmallIntegerField("Type 2 Teams Assigned", choices=sorted(NW_TYPE_2_TEAMS), blank=False,
                                                     help_text="How many NW Type 2 teams are currently assigned?")
    type_3_teams_assigned = models.SmallIntegerField("Type 3 Teams Assigned", choices=sorted(WA_TYPE_3_TEAMS), blank=False,
                                                     help_text="How many Washington Type 3 teams are currently assigned?", default=0)
    
    westside_dnr_responses_count = models.IntegerField("YTD Westside DNR Responses", blank=False)
    westside_dnr_fire_count = models.IntegerField("YTD Westside DNR Fires", blank=False)
    westside_dnr_fire_acres = models.IntegerField("YTD Westside DNR Fire Acres", blank=False)
    westside_all_fire_acres = models.IntegerField("YTD Westside All Acres", blank=False)

    eastside_dnr_responses_count = models.IntegerField("YTD Eastside DNR Responses", blank=False)
    eastside_dnr_fire_count = models.IntegerField("YTD Eastside DNR Fires", blank=False)
    eastside_dnr_fire_acres = models.IntegerField("YTD Eastside DNR Fire Acres", blank=False)
    eastside_all_fire_acres = models.IntegerField("YTD Eastside All Acres", blank=False)

    # intel docs
    intel_report_doc = models.FileField(verbose_name="Intelligence Report", upload_to='intel_docs/', validators=[FileExtensionValidator(allowed_extensions=['pdf'])], help_text="This will only accept PDF files!")
    fire_weather_doc = models.FileField(verbose_name="Fire Weather Report", upload_to='intel_docs/', validators=[FileExtensionValidator(allowed_extensions=['pdf'])], help_text="This will only accept PDF files!")
    fuels_danger_report_doc = models.FileField(verbose_name="Fuels/Fire Danger Report", upload_to='intel_docs/', validators=[FileExtensionValidator(allowed_extensions=['pdf'])], help_text="This will only accept PDF files!")

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
