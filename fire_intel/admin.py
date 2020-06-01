from django.contrib import admin
from .models import *

# Register your models here.
admin.site.site_header = "Fire Intel Dashboard"
admin.site.index_title = "Intel Reports"


class OverviewIntelReportAdmin(admin.ModelAdmin):

    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Situation Snapshot", {
            'fields': ['preparedness_level_national', 'preparedness_level_nw', 'type_1_teams_assigned',
                       'type_2_teams_assigned']}),

        ("Westside Fire Statistics", {
            'fields': ['westside_dnr_responses_count', 'westside_dnr_fire_count', 'westside_dnr_fire_acres',
                       'westside_all_fire_acres']}),

        ("Eastside Fire Statistics", {
            'fields': ['eastside_dnr_responses_count', 'eastside_dnr_fire_count', 'eastside_dnr_fire_acres',
                       'eastside_all_fire_acres']}),

        ("Report PDF File Uploads", {
            'fields': ['intel_report_doc', 'fire_weather_doc', 'fuels_danger_report_doc']}),
    ]


class AviationIntelReportAdmin(admin.ModelAdmin):

    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Westside Aviation Resources", {'fields':['westside_rotors', 'westside_firebosses', 'westside_atgs']}),

        ("Eastside Aviation Resources", {'fields':['eastside_rotors', 'eastside_firebosses', 'eastside_atgs']}),

        ("In Region Aviation Resources", {'fields':['in_region_vlat', 'in_region_lat']}),
        
        ]


class RegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Fire Stats Snapshot", {
            'fields': ['total_responses', 'total_dnr_fires', 'total_dnr_acres', 'total_response_acres']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


class NortheastRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


class SoutheastRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


class NorthwestRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]



class SouthPugetSoundRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


class PacificCascadeRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Fire Stats Snapshot", {
            'fields': ['total_responses', 'total_dnr_fires', 'total_dnr_acres', 'total_response_acres']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


class OlympicRegionIntelReportAdmin(admin.ModelAdmin):
    
    # replace "save and add another" with "save as" - essential copy this form and save it as new one
    save_as = True

    fieldsets = [
        
        ("Date of Report", {
            'fields': ['date_of_report']}),

        ("Region Situation Snapshot", {
            'fields': ['new_initial_attack', 'new_ia_acres', 'region_large_fires']}),

        ("Region Resource Availablity",
         {'fields': ['committed_engines', 'committed_crews', 'available_engines', 'available_crews']}),
        
        ]


# register the models with the admin site
admin.site.register(OverviewIntelReport, OverviewIntelReportAdmin)
admin.site.register(AviationIntelReport, AviationIntelReportAdmin)
admin.site.register(NortheastRegionIntelReport, RegionIntelReportAdmin)
admin.site.register(SoutheastRegionIntelReport, RegionIntelReportAdmin)
admin.site.register(NorthwestRegionIntelReport, RegionIntelReportAdmin)
admin.site.register(SouthPugetSoundRegionIntelReport, RegionIntelReportAdmin)
admin.site.register(PacificCascadeRegionIntelReport, RegionIntelReportAdmin)
admin.site.register(OlympicRegionIntelReport, RegionIntelReportAdmin)
