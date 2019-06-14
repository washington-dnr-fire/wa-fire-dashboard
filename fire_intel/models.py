from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


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
        (8, 8),
    }

    date_of_report = models.DateTimeField(auto_now=True, blank=False)

    preparedness_level_national = models.SmallIntegerField(choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                           help_text="What's the national preparedness level? (out of 5)")
    preparedness_level_nw = models.SmallIntegerField(choices=sorted(PREPAREDNESS_LEVELS), blank=False,
                                                     help_text="What's the curernt NW GACC preparedness level? (out of 5)")
    type_1_teams_assigned = models.SmallIntegerField(choices=sorted(NW_TYPE_1_TEAMS), blank=False,
                                                     help_text="How many out of the five Type 1 teams are currently assigned?")
    type_2_teams_assigned = models.SmallIntegerField(choices=sorted(NW_TYPE_2_TEAMS), blank=False,
                                                     help_text="How many out of the eight Type 2 teams are currently assigned?")
    wa_large_fires = models.IntegerField(blank=False, help_text="How many WA-based large fires are there currently?")
    dnr_ia_fires = models.IntegerField(blank=False, help_text="How many DNR-based IA fires are there currently?")

    # fire statistics
    westside_dnr_responses_count = models.IntegerField(blank=False, help_text="How many DNR Responses total on the westside?")
    westside_dnr_fire_count = models.IntegerField(blank=False, help_text="How many DNR Fires total on the westside?")
    westside_dnr_fire_acres = models.IntegerField(blank=False, help_text="How many DNR Fire acres burned on the westside?")
    westside_all_fire_acres = models.IntegerField(blank=False, help_text="How many acres burned on the westside?")

    eastside_dnr_responses_count = models.IntegerField(blank=False, help_text="How many DNR Responses total on the eastside?")
    eastside_dnr_fire_count = models.IntegerField(blank=False, help_text="How many DNR Fires total on the eastside?")
    eastside_dnr_fire_acres = models.IntegerField(blank=False, help_text="How many DNR Fire acres burned on the eastside?")
    eastside_all_fire_acres = models.IntegerField(blank=False, help_text="How many acres burned on the eastside?")

    nw_committed_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_committed_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_available_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    nw_available_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    se_committed_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_committed_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_available_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    se_available_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    ne_committed_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_committed_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_available_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    ne_available_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    sps_committed_engines = models.SmallIntegerField(blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_committed_crews = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_available_engines = models.SmallIntegerField(blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    sps_available_crews = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])

    oly_committed_engines = models.SmallIntegerField(blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_committed_crews = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_available_engines = models.SmallIntegerField(blank=False,
                                                     validators=[MinValueValidator(0), MaxValueValidator(250)])
    oly_available_crews = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(250)])

    pc_committed_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_committed_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_available_engines = models.SmallIntegerField(blank=False,
                                                    validators=[MinValueValidator(0), MaxValueValidator(250)])
    pc_available_crews = models.SmallIntegerField(blank=False,
                                                  validators=[MinValueValidator(0), MaxValueValidator(250)])

    westside_rotors = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    westside_firebosses = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(100)])
    westside_atgs = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    eastside_rotors = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    eastside_firebosses = models.SmallIntegerField(blank=False,
                                                   validators=[MinValueValidator(0), MaxValueValidator(100)])
    eastside_atgs = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    in_region_vlat = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])
    in_region_lat = models.SmallIntegerField(blank=False, validators=[MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
        return "Intel Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))
