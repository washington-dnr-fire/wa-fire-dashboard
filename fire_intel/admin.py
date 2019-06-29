from django.contrib import admin
from .models import IntelReport

# Register your models here.
admin.site.site_header = "Fire Intel Dashboard"
admin.site.index_title = "Intel Reports"


class IntelReportAdmin(admin.ModelAdmin):
    fieldsets = [
        ("Situation Snapshot", {
            'fields': ['preparedness_level_national', 'preparedness_level_nw', 'type_1_teams_assigned',
                       'type_2_teams_assigned', 'wa_large_fires', 'dnr_ia_fires']}),

        ("OLS Region Resources",
         {'fields': ['oly_committed_engines', 'oly_committed_crews', 'oly_available_engines', 'oly_available_crews']}),
        ("NWS Region Resources",
         {'fields': ['nw_committed_engines', 'nw_committed_crews', 'nw_available_engines', 'nw_available_crews']}),
        ("SPS Region Resources",
         {'fields': ['sps_committed_engines', 'sps_committed_crews', 'sps_available_engines', 'sps_available_crews']}),
        ("PCS Region Resources",
         {'fields': ['pc_committed_engines', 'pc_committed_crews', 'pc_available_engines', 'pc_available_crews']}),
        ("SES Region Resources",
         {'fields': ['se_committed_engines', 'se_committed_crews', 'se_available_engines', 'se_available_crews']}),
        ("NES Region Resources",
         {'fields': ['ne_committed_engines', 'ne_committed_crews', 'ne_available_engines', 'ne_available_crews']}),

        ("Westside Aviation Resources", {'fields':['westside_rotors', 'westside_firebosses', 'westside_atgs']}),
        ("Eastside Aviation Resources", {'fields':['eastside_rotors', 'eastside_firebosses', 'eastside_atgs']}),
        ("In Region Aviation Resources", {'fields':['in_region_vlat', 'in_region_lat']}),

        ("Westside Fire Statistics", {
            'fields': ['westside_dnr_responses_count', 'westside_dnr_fire_count', 'westside_dnr_fire_acres',
                       'westside_all_fire_acres']}),
        ("Eastside Fire Statistics", {
            'fields': ['eastside_dnr_responses_count', 'eastside_dnr_fire_count', 'eastside_dnr_fire_acres',
                       'eastside_all_fire_acres']}),

    ]


admin.site.register(IntelReport, IntelReportAdmin)