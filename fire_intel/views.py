from django.http import HttpResponse
from django.template import loader
from datetime import timezone
from django.http import JsonResponse
import requests

# import all models because we USE THEM ALL!
from .models import *


# utility function
def get_better_date_txt(input_date):
    return input_date.replace(tzinfo=timezone.utc).astimezone(tz=None).strftime("%A, %b %d, %Y at %H:%M %Z")


# Create your views here.
def index(request):
    template = loader.get_template('fire_intel/index.html')
    # if IntelReport.objects.count() > 0:
    # grab the latest intel records
    overview_intel = OverviewIntelReport.objects.latest("date_of_report")
    aviation = AviationIntelReport.objects.latest("date_of_report")
    ne = NortheastRegionIntelReport.objects.latest("date_of_report")
    se = SoutheastRegionIntelReport.objects.latest("date_of_report")
    nw = NorthwestRegionIntelReport.objects.latest("date_of_report")
    sps = SouthPugetSoundRegionIntelReport.objects.latest("date_of_report")
    pc = PacificCascadeRegionIntelReport.objects.latest("date_of_report")
    oly = OlympicRegionIntelReport.objects.latest("date_of_report")

    context = {
        'overview_intel_data': overview_intel,
        'aviation_data': aviation,
        'ne_data': ne,
        'se_data': se,
        'nw_data': nw,
        'sps_data': sps,
        'pc_data': pc,
        'oly_data': oly,
        'updated_date_txt': get_better_date_txt(overview_intel.date_of_report),

        # all summed up information
        'wa_large_fires_sum': (ne.region_large_fires + se.region_large_fires  + nw.region_large_fires  + sps.region_large_fires + pc.region_large_fires  + oly.region_large_fires) ,
        'dnr_ia_fires_sum': round(ne.new_ia_acres + se.new_ia_acres + nw.new_ia_acres + sps.new_ia_acres + pc.new_ia_acres + oly.new_ia_acres, 2),
        'dnr_response_count_sum': overview_intel.westside_dnr_responses_count + overview_intel.eastside_dnr_responses_count,
        'dnr_fire_count_sum': overview_intel.westside_dnr_fire_count + overview_intel.eastside_dnr_fire_count,
        'dnr_fire_acres_sum': round(overview_intel.westside_dnr_fire_acres + overview_intel.eastside_dnr_fire_acres, 2),
        'all_fire_acres_sum': round(overview_intel.westside_all_fire_acres + overview_intel.eastside_all_fire_acres, 2),
        # 'preparedness_level_national': latest_intel_report.preparedness_level_national,
        # 'preparedness_level_nw': latest_intel_report.preparedness_level_nw,
        # 'type_1_teams_assigned': latest_intel_report.type_1_teams_assigned,
        # 'type_2_teams_assigned': latest_intel_report.type_2_teams_assigned,
        # 'wa_large_fires': latest_intel_report.wa_large_fires,
        # 'dnr_ia_fires': latest_intel_report.dnr_ia_fires,
        # 'westside_dnr_responses_count': latest_intel_report.westside_dnr_responses_count,
        # 'westside_dnr_fire_count': latest_intel_report.westside_dnr_fire_count,
        # 'westside_dnr_fire_acres': latest_intel_report.westside_dnr_fire_acres,
        # 'westside_all_fire_acres': latest_intel_report.westside_all_fire_acres,
        # 'eastside_dnr_responses_count': latest_intel_report.eastside_dnr_responses_count,
        # 'eastside_dnr_fire_count': latest_intel_report.eastside_dnr_fire_count,
        # 'eastside_dnr_fire_acres': latest_intel_report.eastside_dnr_fire_acres,
        # 'eastside_all_fire_acres': latest_intel_report.eastside_all_fire_acres,
        # 'sum_dnr_response_count': latest_intel_report.westside_dnr_responses_count + latest_intel_report.eastside_dnr_responses_count,
        # 'sum_dnr_fire_count': latest_intel_report.westside_dnr_fire_count + latest_intel_report.eastside_dnr_fire_count,
        # 'sum_dnr_fire_acres': latest_intel_report.westside_dnr_fire_acres + latest_intel_report.eastside_dnr_fire_acres,
        # 'sum_all_fire_acres': latest_intel_report.westside_all_fire_acres + latest_intel_report.eastside_all_fire_acres,
        # 'ne_committed_engines': latest_intel_report.ne_committed_engines,
        # 'ne_committed_crews': latest_intel_report.ne_committed_crews,
        # 'ne_available_engines': latest_intel_report.ne_available_engines,
        # 'ne_available_crews': latest_intel_report.ne_available_crews,
        # 'se_committed_engines': latest_intel_report.se_committed_engines,
        # 'se_committed_crews': latest_intel_report.se_committed_crews,
        # 'se_available_engines': latest_intel_report.se_available_engines,
        # 'se_available_crews': latest_intel_report.se_available_crews,
        # 'nw_committed_engines': latest_intel_report.nw_committed_engines,
        # 'nw_committed_crews': "-",  # Northwest doesn't have any crews currently
        # 'nw_available_engines': latest_intel_report.nw_available_engines,
        # 'nw_available_crews': "-",  # Northwest doesn't have any crews currently
        # 'pc_committed_engines': latest_intel_report.pc_committed_engines,
        # 'pc_committed_crews': latest_intel_report.pc_committed_crews,
        # 'pc_available_engines': latest_intel_report.pc_available_engines,
        # 'pc_available_crews': latest_intel_report.pc_available_crews,
        # 'oly_committed_engines': latest_intel_report.oly_committed_engines,
        # 'oly_committed_crews': latest_intel_report.oly_committed_crews,
        # 'oly_available_engines': latest_intel_report.oly_available_engines,
        # 'oly_available_crews': latest_intel_report.oly_available_crews,
        # 'sps_committed_engines': latest_intel_report.sps_committed_engines,
        # 'sps_committed_crews': latest_intel_report.sps_committed_crews,
        # 'sps_available_engines': latest_intel_report.sps_available_engines,
        # 'sps_available_crews': latest_intel_report.sps_available_crews,
        # 'westside_rotors': latest_intel_report.westside_rotors,
        # 'westside_firebosses': latest_intel_report.westside_firebosses,
        # 'westside_atgs': latest_intel_report.westside_atgs,
        # 'eastside_rotors': latest_intel_report.eastside_rotors,
        # 'eastside_firebosses': latest_intel_report.eastside_firebosses,
        # 'eastside_atgs': latest_intel_report.eastside_atgs,
        # 'in_region_vlat': latest_intel_report.in_region_vlat,
        # 'in_region_lat': latest_intel_report.in_region_lat,
    }
    return HttpResponse(template.render(context, request))


def profile(request):
    template = loader.get_template('fire_intel/profile.html')
    if OverviewIntelReport.objects.count() > 0:
        intel_report_overview = OverviewIntelReport.objects.latest("date_of_report")
        updated_date_txt = intel_report_overview.date_of_report.strftime(
            "%m/%d/%Y, %H:%M:%S")
    else:
        updated_date_txt = "No reports available"
    if request.user.is_authenticated:
        user = request.user.username
        first_name = request.user.first_name
        last_name = request.user.last_name
        email = request.user.email
        context = {
            'username': user,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'updated_date_txt': updated_date_txt,
        }
        return HttpResponse(template.render(context, request))
    else:
        context = {
            'updated_date_txt': updated_date_txt,
        }
        return HttpResponse(template.render(context, request))

def season_end(request):
    template = loader.get_template('fire_intel/season_end.html')
    return HttpResponse(template.render(None, request))

# def current_fire_stats(request):
#     all_reports = list(IntelReport.objects.values('id', 'date_of_report', 'westside_dnr_responses_count', 'westside_dnr_fire_count', 'westside_dnr_fire_acres',
#                                                   'westside_all_fire_acres',  'eastside_dnr_responses_count', 'eastside_dnr_fire_count', 'eastside_dnr_fire_acres', 'eastside_all_fire_acres'))
#     return JsonResponse({'data':all_reports}, safe=False)

def egp_data(request, layer_type, layer_id):
    referer = 'http://dnr.wa.gov'
    WA_ENVELOPE = {
        "xmin": -124.85,
        "ymin": 45.49,
        "xmax": -116.69,
        "ymax": 49.1,
    }

    if layer_type == "active_incidents":
        # layer id follows source map service id
        map_service = "https://egp.nwcg.gov/arcgis/rest/services/FireCOP/PublicActiveIncidents/MapServer/{}".format(
            layer_id)
        where = ''
    if layer_type == "blm_lightning":
        # layer id follows source map service id
        map_service = "https://egp.nwcg.gov/arcgis/rest/services/FireCOP/LightningStrikes/MapServer/{}".format(layer_id)
        where = ''
    if layer_type == "hotspots":
        # layer id follows source map service id
        map_service = "https://egp.nwcg.gov/arcgis/rest/services/FireCOP/FireDetections/MapServer/{}".format(layer_id)
        where = ''

    if layer_type == 'HMS_detects':
        map_service = "https://wildfire.cr.usgs.gov/arcgis/rest/services/geomac_dyn/MapServer/{}".format(layer_id)
        where = "load_stat IN ('Active Burning', '24 Hrs', '48 Hrs')"

    # making the EGP data request
    request_params = {
        'token': OverviewIntelReport.get_that_egp_token(),
        'where': str(where),
        'geometry': str(WA_ENVELOPE),
        'geometryType': 'esriGeometryEnvelope',
        'inSR': '4326',
        'spatialRel': 'esriSpatialRelIntersects',
        'outFields': '*',
        'f': 'geojson',
    }

    if layer_type == "HMS_detects":
        del request_params['token']

    s = requests.Session()
    s.headers.update({'referer': referer})
    r = s.post(map_service + "/query?", data=request_params)
    results = r.json()
    return JsonResponse(results, safe=False)
