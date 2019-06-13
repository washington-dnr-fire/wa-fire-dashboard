from django.contrib import admin
from .models import IntelReport

# Register your models here.
admin.site.site_header = "Fire Intel App Admin"
admin.site.index_title = "Site and Model Administration"


class IntelReportAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Summary Information", {'fields': ['preparedness_level_national', 'preparedness_level_nw','type_1_teams_assigned','type_2_teams_assigned', 'wa_large_fires', 'dnr_ia_fires']}),
        ("NE Region Resources", {'fields': ['ne_committed_engines','ne_committed_crews','ne_available_engines','ne_available_crews']}),
        ("SE Region Resources", {'fields': ['se_committed_engines','se_committed_crews','se_available_engines','se_available_crews']}),
        ("NW Region Resources", {'fields': ['nw_committed_engines','nw_committed_crews','nw_available_engines','nw_available_crews']}),
        ("PC Region Resources", {'fields': ['pc_committed_engines','pc_committed_crews','pc_available_engines','pc_available_crews']}),
        ("OLY Region Resources", {'fields': ['oly_committed_engines','oly_committed_crews','oly_available_engines','oly_available_crews']}),
        ("SPS Region Resources", {'fields': ['sps_committed_engines','sps_committed_crews','sps_available_engines','sps_available_crews']}),
        ("Westside Aviation Resources", {'fields':['westside_rotors', 'westside_firebosses', 'westside_atgs']}),
        ("Eastside Aviation Resources", {'fields':['eastside_rotors', 'eastside_firebosses', 'eastside_atgs']}),
        ("In Region Aviation Resources", {'fields':['in_region_vlat', 'in_region_lat']}),
    ]


admin.site.register(IntelReport, IntelReportAdmin)