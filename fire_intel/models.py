from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Intel Model
class IntelReport(models.Model):

    PREPAREDNESS_LEVELS = {
        (1,1),
        (2,2),
        (3,3),
        (4,4),
        (5,5),
    }

    NW_TYPE_1_TEAMS = {
        (0,0),
        (1,1),
        (2,2),
        (3,3),
        (4,4),
        (5,5),
    }

    NW_TYPE_2_TEAMS = {
        (0,0),
        (1,1),
        (2,2),
        (3,3),
        (4,4),
        (5,5),
        (6,6),
        (7,7),
        (8,8),
    }

    date_of_report = models.DateTimeField(auto_now=True, blank=False)

    preparedness_level_national = models.SmallIntegerField(choices=sorted(PREPAREDNESS_LEVELS), blank=False, help_text="What's the national preparedness level? (out of 5)")
    preparedness_level_nw = models.SmallIntegerField(choices=sorted(PREPAREDNESS_LEVELS), blank=False, help_text="What's the curernt NW GACC preparedness level? (out of 5)")
    type_1_teams_assigned = models.SmallIntegerField(choices=sorted(NW_TYPE_1_TEAMS), blank=False, help_text="How many out of the five Type 1 teams are currently assigned?")
    type_2_teams_assigned = models.SmallIntegerField(choices=sorted(NW_TYPE_2_TEAMS), blank=False, help_text="How many out of the eight Type 2 teams are currently assigned?")
    wa_large_fires = models.IntegerField(blank=False, help_text="How many WA-based large fires are there currently?")
    dnr_ia_fires = models.IntegerField(blank=False, help_text="How many DNR-based IA fires are there currently?")

    nw_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    nw_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    nw_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    nw_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    se_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    se_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    se_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    se_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    ne_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    ne_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    ne_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    ne_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    sps_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    sps_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    sps_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    sps_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    oly_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    oly_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    oly_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    oly_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    pc_committed_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    pc_committed_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    pc_available_engines = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])
    pc_available_crews = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(250)])

    westside_rotors = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    westside_firebosses = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    westside_vlat = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    westside_ang = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])

    eastside_rotors = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    eastside_firebosses = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    eastside_vlat = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    eastside_ang = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])

    in_region_rotors = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    in_region_firebosses = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    in_region_vlat = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])
    in_region_ang = models.SmallIntegerField(blank=False, validators= [MinValueValidator(0), MaxValueValidator(100)])

    def __str__(self):
         return "Intel Report: {}".format(self.date_of_report.strftime("%m/%d/%Y, %H:%M:%S"))

    # ['preparedness_level_national', 'preparedness_level_nw', 'type_1_teams_assigned', 'type_2_teams_assigned', 'wa_large_fires', 'dnr_ia_fires', 'ne_committed_engines', 'ne_committed_crews', 'ne_available_engines', 'ne_available_crews', 'se_committed_engines', 'se_committed_crews', 'se_available_engines', 'se_available_crews', 'nw_committed_engines', 'nw_committed_crews', 'nw_available_engines', 'nw_available_crews', 'pc_committed_engines', 'pc_committed_crews', 'pc_available_engines', 'pc_available_crews', 'oly_committed_engines', 'oly_committed_crews', 'oly_available_engines', 'oly_available_crews', 'sps_committed_engines', 'sps_committed_crews', 'sps_available_engines', 'sps_available_crews', , 'westside_rotors', 'westside_firebosses', 'westside_vlat', 'westside_ang', 'eastside_rotors', 'eastside_firebosses', 'eastside_vlat', 'eastside_ang', 'in_region_rotors', 'in_region_firebosses', 'in_region_vlat', 'in_region_ang']
