from django.http import HttpResponse
from django.template import loader
from .models import IntelReport
from datetime import timezone
from django.http import JsonResponse
import requests


# Create your views here.
def index(request):
    template = loader.get_template('fire_intel/index.html')
    if IntelReport.objects.count() > 0:
        latest_intel_report = IntelReport.objects.latest("date_of_report")
        updated_date_txt = latest_intel_report.date_of_report.replace(tzinfo=timezone.utc).astimezone(tz=None).strftime(
            "%A, %b %d, %Y at %H:%M %Z")
        context = {
            'preparedness_level_national': latest_intel_report.preparedness_level_national,
            'preparedness_level_nw': latest_intel_report.preparedness_level_nw,
            'type_1_teams_assigned': latest_intel_report.type_1_teams_assigned,
            'type_2_teams_assigned': latest_intel_report.type_2_teams_assigned,
            'wa_large_fires': latest_intel_report.wa_large_fires,
            'dnr_ia_fires': latest_intel_report.dnr_ia_fires,
            'westside_dnr_responses_count': latest_intel_report.westside_dnr_responses_count,
            'westside_dnr_fire_count': latest_intel_report.westside_dnr_fire_count,
            'westside_dnr_fire_acres': latest_intel_report.westside_dnr_fire_acres,
            'westside_all_fire_acres': latest_intel_report.westside_all_fire_acres,
            'eastside_dnr_responses_count': latest_intel_report.eastside_dnr_responses_count,
            'eastside_dnr_fire_count': latest_intel_report.eastside_dnr_fire_count,
            'eastside_dnr_fire_acres': latest_intel_report.eastside_dnr_fire_acres,
            'eastside_all_fire_acres': latest_intel_report.eastside_all_fire_acres,
            'sum_dnr_response_count': latest_intel_report.westside_dnr_responses_count + latest_intel_report.eastside_dnr_responses_count,
            'sum_dnr_fire_count': latest_intel_report.westside_dnr_fire_count + latest_intel_report.eastside_dnr_fire_count,
            'sum_dnr_fire_acres': latest_intel_report.westside_dnr_fire_acres + latest_intel_report.eastside_dnr_fire_acres,
            'sum_all_fire_acres': latest_intel_report.westside_all_fire_acres + latest_intel_report.eastside_all_fire_acres,
            'ne_committed_engines': latest_intel_report.ne_committed_engines,
            'ne_committed_crews': latest_intel_report.ne_committed_crews,
            'ne_available_engines': latest_intel_report.ne_available_engines,
            'ne_available_crews': latest_intel_report.ne_available_crews,
            'se_committed_engines': latest_intel_report.se_committed_engines,
            'se_committed_crews': latest_intel_report.se_committed_crews,
            'se_available_engines': latest_intel_report.se_available_engines,
            'se_available_crews': latest_intel_report.se_available_crews,
            'nw_committed_engines': latest_intel_report.nw_committed_engines,
            'nw_committed_crews': latest_intel_report.nw_committed_crews,
            'nw_available_engines': latest_intel_report.nw_available_engines,
            'nw_available_crews': latest_intel_report.nw_available_crews,
            'pc_committed_engines': latest_intel_report.pc_committed_engines,
            'pc_committed_crews': latest_intel_report.pc_committed_crews,
            'pc_available_engines': latest_intel_report.pc_available_engines,
            'pc_available_crews': latest_intel_report.pc_available_crews,
            'oly_committed_engines': latest_intel_report.oly_committed_engines,
            'oly_committed_crews': latest_intel_report.oly_committed_crews,
            'oly_available_engines': latest_intel_report.oly_available_engines,
            'oly_available_crews': latest_intel_report.oly_available_crews,
            'sps_committed_engines': latest_intel_report.sps_committed_engines,
            'sps_committed_crews': latest_intel_report.sps_committed_crews,
            'sps_available_engines': latest_intel_report.sps_available_engines,
            'sps_available_crews': latest_intel_report.sps_available_crews,
            'westside_rotors': latest_intel_report.westside_rotors,
            'westside_firebosses': latest_intel_report.westside_firebosses,
            'westside_atgs': latest_intel_report.westside_atgs,
            'eastside_rotors': latest_intel_report.eastside_rotors,
            'eastside_firebosses': latest_intel_report.eastside_firebosses,
            'eastside_atgs': latest_intel_report.eastside_atgs,
            'in_region_vlat': latest_intel_report.in_region_vlat,
            'in_region_lat': latest_intel_report.in_region_lat,
            'updated_date_txt': updated_date_txt,
        }
    else:
        context = {
            'preparedness_level_national': 0,
            'preparedness_level_nw': 0,
            'type_1_teams_assigned': 0,
            'type_2_teams_assigned': 0,
            'wa_large_fires': 0,
            'dnr_ia_fires': 0,
            'westside_dnr_responses_count': 0,
            'westside_dnr_fire_count': 0,
            'westside_dnr_fire_acres': 0,
            'westside_all_fire_acres': 0,
            'eastside_dnr_responses_count': 0,
            'eastside_dnr_fire_count': 0,
            'eastside_dnr_fire_acres': 0,
            'eastside_all_fire_acres': 0,
            'sum_dnr_response_count': 0,
            'sum_dnr_fire_count': 0,
            'sum_dnr_fire_acres': 0,
            'sum_all_fire_acres': 0,
            'ne_committed_engines': 0,
            'ne_committed_crews': 0,
            'ne_available_engines': 0,
            'ne_available_crews': 0,
            'se_committed_engines': 0,
            'se_committed_crews': 0,
            'se_available_engines': 0,
            'se_available_crews': 0,
            'nw_committed_engines': 0,
            'nw_committed_crews': 0,
            'nw_available_engines': 0,
            'nw_available_crews': 0,
            'pc_committed_engines': 0,
            'pc_committed_crews': 0,
            'pc_available_engines': 0,
            'pc_available_crews': 0,
            'oly_committed_engines': 0,
            'oly_committed_crews': 0,
            'oly_available_engines': 0,
            'oly_available_crews': 0,
            'sps_committed_engines': 0,
            'sps_committed_crews': 0,
            'sps_available_engines': 0,
            'sps_available_crews': 0,
            'westside_rotors': 0,
            'westside_firebosses': 0,
            'westside_atgs': 0,
            'eastside_rotors': 0,
            'eastside_firebosses': 0,
            'eastside_atgs': 0,
            'in_region_vlat': 0,
            'in_region_lat': 0,
            'updated_date_txt': "No reports available",
        }
    return HttpResponse(template.render(context, request))


def profile(request):
    template = loader.get_template('fire_intel/profile.html')
    if IntelReport.objects.count() > 0:
        latest_intel_report = IntelReport.objects.latest("date_of_report")
        updated_date_txt = latest_intel_report.date_of_report.strftime(
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


def egp_data(request, layer_id):

    egp_active_incident_map_service = "https://egp.nwcg.gov/arcgis/rest/services/FireCOP/ActiveIncidents/MapServer/{}".format(layer_id)
    referer = 'http://dnr.wa.gov'

    OR_WA_ENVELOPE = {
        "xmin":-124.86082024299998,
        "ymin":41.99208161100006,
        "xmax":-116.46316225199996,
        "ymax":49.002431632000025,
        "spatialReference": {"wkid": 4326, "latestWkid": 4326}
        }

    # making the lightning points request
    # basic check on the count - to test the token
    request_params = {
        'token': IntelReport.get_that_egp_token(),
        'where': "GACC='NWCC'",
        'f': 'geojson',
        'geometry': str(OR_WA_ENVELOPE),
        'outFields': '*',
        }

    s = requests.Session()
    s.headers.update({'referer': referer})
    r = s.post(egp_active_incident_map_service + "/query?", data=request_params)
    results = r.json()
    return JsonResponse(results, safe=False)