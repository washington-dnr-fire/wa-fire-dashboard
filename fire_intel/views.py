from django.http import HttpResponse, HttpResponseNotFound
from django.template import loader
from datetime import timezone
from django.http import JsonResponse, Http404
from django.shortcuts import redirect
from .decorators import ie_test_redirect
from .utils import get_that_egp_token
from project_space_crab.settings import IE_BROWSER_REDIRECT_URL, REGION_ALLOWED_URL_SET
import requests

# import all models because we USE THEM ALL!
from .models import *

REGION_INTEL_MODELS = [NortheastRegionIntelReport, SoutheastRegionIntelReport,NorthwestRegionIntelReport, SouthPugetSoundRegionIntelReport, PacificCascadeRegionIntelReport, OlympicRegionIntelReport]

# utility functions
def get_better_date_txt(input_date):
    return input_date.replace(tzinfo=timezone.utc).astimezone(tz=None).strftime("%A, %b %d, %Y at %H:%M %Z")


def get_ia_counts(classmodels_list):
    """returns dict of fire count and acres in last 24hrs and 48hrs
    example = {"fire_count_24hr": 0,
                        "fire_acres_24hr": 0,
                        "fire_count_48hr": 0,
                        "fire_acres_48hr": 0}
    the above dictionary is what comes out, see models.py
    """
    counts_dict = dict()
    for model in classmodels_list:
        model_dict = model.counts.get_24hr_48hr_fire_count_and_acres_dict()
        for val in model_dict:
            try:
                counts_dict[val] += model_dict[val]
            except KeyError:
                counts_dict[val] = model_dict[val]
    return counts_dict
    

# Create your views here.
@ie_test_redirect
def index(request):

    # grab the latest intel records
    overview_intel = OverviewIntelReport.objects.get_latest_intel_report()
    aviation = AviationIntelReport.objects.get_latest_intel_report()
    ne = NortheastRegionIntelReport.objects.get_latest_intel_report()
    se = SoutheastRegionIntelReport.objects.get_latest_intel_report()
    nw = NorthwestRegionIntelReport.objects.get_latest_intel_report()
    sps = SouthPugetSoundRegionIntelReport.objects.get_latest_intel_report()
    pc = PacificCascadeRegionIntelReport.objects.get_latest_intel_report()
    oly = OlympicRegionIntelReport.objects.get_latest_intel_report()

    overview_model_data = [overview_intel, aviation]
    region_model_data = [ne, se, nw, sps, pc, oly]

    available_model_data = overview_model_data + region_model_data
    ia_acres_and_fire_counts_dict = get_ia_counts(REGION_INTEL_MODELS)

    # test that every model has data - otherwise set to zero and null
    if all(i for i in available_model_data):
        context = {
            'overview_intel_data': overview_intel,
            'aviation_data': aviation,
            'ne_data': ne,
            'se_data': se,
            'nw_data': nw,
            'sps_data': sps,
            'pc_data': pc,
            'oly_data': oly,

            # set this to 0 if there are any nulls
            'updated_date_txt': get_better_date_txt(overview_intel.date_of_report),
            'wa_large_fires_sum': sum(i.region_large_fires for i in region_model_data),
            'dnr_ia_fires_sum': ia_acres_and_fire_counts_dict["fire_count_24hr"],
            'dnr_ia_fires_sum48': ia_acres_and_fire_counts_dict["fire_count_48hr"],
            'dnr_response_count_sum': (overview_intel.westside_dnr_responses_count + overview_intel.eastside_dnr_responses_count),
            'dnr_fire_count_sum': (overview_intel.westside_dnr_fire_count + overview_intel.eastside_dnr_fire_count),
            'dnr_fire_acres_sum': round(overview_intel.westside_dnr_fire_acres + overview_intel.eastside_dnr_fire_acres, 2),
            'all_fire_acres_sum': round(overview_intel.westside_all_fire_acres + overview_intel.eastside_all_fire_acres, 2),
            'available_in_region_engines_sum': sum(i.committed_engines for i in region_model_data),
            'available_out_of_region_engines_sum': sum(i.available_engines for i in region_model_data),
            'available_in_region_crews_sum': sum(i.committed_crews for i in region_model_data),
            'available_out_of_region_crews_sum': sum(i.available_crews for i in region_model_data),
            'total_rotors': (aviation.westside_rotors + aviation.eastside_rotors),
            'total_fireboss': (aviation.westside_firebosses + aviation.eastside_firebosses),
            'total_airattack': (aviation.westside_atgs + aviation.eastside_atgs),
            'total_lat': (aviation.in_region_lat),
            'total_vlat': (aviation.in_region_vlat)
        }
    else:
        context = {
            'overview_intel_data': overview_intel,
            'aviation_data': aviation,
            'ne_data': ne,
            'se_data': se,
            'nw_data': nw,
            'sps_data': sps,
            'pc_data': pc,
            'oly_data': oly,

            # set this to 0 if there are any nulls
            'updated_date_txt': "INCOMPLETE DATA",
            'wa_large_fires_sum': 0,
            'dnr_ia_fires_sum': 0,
            'dnr_ia_fires_sum48': 0,
            'dnr_response_count_sum': 0,
            'dnr_fire_count_sum': 0,
            'dnr_fire_acres_sum': 0,
            'all_fire_acres_sum': 0,
            'available_in_region_engines_sum':0,
            'available_out_of_region_engines_sum': 0,
            'available_in_region_crews_sum': 0,
            'available_out_of_region_crews_sum': 0,
            'total_rotors': 0,
            'total_fireboss': 0,
            'total_airattack': 0,
            'total_lat': 0,
            'total_vlat': 0

        }
    template = loader.get_template('fire_intel/index.html')
    return HttpResponse(template.render(context, request))


@ie_test_redirect
def profile(request):
    
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
        template = loader.get_template('fire_intel/profile.html')
        return HttpResponse(template.render(context, request))
    else:
        context = {
            'updated_date_txt': updated_date_txt,
        }
        template = loader.get_template('fire_intel/profile.html')
        return HttpResponse(template.render(context, request))

@ie_test_redirect
def season_end(request):
    template = loader.get_template('fire_intel/season_end.html')
    return HttpResponse(template.render(None, request))


def current_fire_stats(request):
    all_overview_intel_reports = list(OverviewIntelReport.objects.values('id', 'date_of_report', 'westside_dnr_responses_count', 'westside_dnr_fire_count', 'westside_dnr_fire_acres',
                                                  'westside_all_fire_acres',  'eastside_dnr_responses_count', 'eastside_dnr_fire_count', 'eastside_dnr_fire_acres', 'eastside_all_fire_acres'))
    return JsonResponse({'data':all_overview_intel_reports}, safe=False)


@ie_test_redirect
def region_view(request, region):

    if region not in REGION_ALLOWED_URL_SET:
        return Http404()

    # grab the latest intel records
    overview_intel = OverviewIntelReport.objects.get_latest_intel_report()
    aviation = AviationIntelReport.objects.get_latest_intel_report()

    # placeholder variables
    region_data = None
    region_short_label = None
    region_long_label = None

    if region == "ne":
        region_data = NortheastRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'NE'
        region_long_label = 'Northeast'
    if region == "se":
        region_data = SoutheastRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'SE'
        region_long_label = 'Southeast'
    if region == "nw":
        region_data = NorthwestRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'NW'
        region_long_label = 'Northwest'
    if region == "sps":
        region_data = SouthPugetSoundRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'SPS'
        region_long_label = 'South Puget Sound'
    if region == "pc":
        region_data = PacificCascadeRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'PC'
        region_long_label = 'Pacific Cascade'
    if region == "oly":
        region_data = OlympicRegionIntelReport.objects.get_latest_intel_report()
        region_short_label = 'OLY'
        region_long_label = 'Olympic'

    available_model_data = {overview_intel, aviation, region_data}

    if all(i for i in available_model_data):
        context = {
            'overview_intel_data': overview_intel,
            'aviation_data': aviation,
            'region_data': region_data,
            'region_short_label': region_short_label,
            'region_long_label': region_long_label,

            # set this to 0 if there are any nulls
            'updated_date_txt': get_better_date_txt(region_data.date_of_report),
            'dnr_response_count_sum': (overview_intel.westside_dnr_responses_count + overview_intel.eastside_dnr_responses_count),
            'dnr_fire_count_sum': (overview_intel.westside_dnr_fire_count + overview_intel.eastside_dnr_fire_count),
            'dnr_fire_acres_sum': round(overview_intel.westside_dnr_fire_acres + overview_intel.eastside_dnr_fire_acres, 2),
            'all_fire_acres_sum': round(overview_intel.westside_all_fire_acres + overview_intel.eastside_all_fire_acres, 2),
        }
    else:
        context = {
            'overview_intel_data': overview_intel,
            'aviation_data': aviation,
            'region_data': region_data,
            'region_short_label': region_short_label,
            'region_long_label': region_long_label,

            # set this to 0 if there are any nulls
            'updated_date_txt': "INCOMPLETE DATA",
            'wa_large_fires_sum': 0,
            'dnr_ia_fires_sum': 0,
            'dnr_response_count_sum': 0,
            'dnr_fire_count_sum': 0,
            'dnr_fire_acres_sum': 0,
            'all_fire_acres_sum': 0,
        }

    template = loader.get_template('fire_intel/region_view.html')
    return HttpResponse(template.render(context, request))



def unsupported_ie(request):
    template = loader.get_template('fire_intel/ie_bad.html')
    return HttpResponse(template.render(None, request))


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

    # making the EGP data request
    request_params = {
        'token': get_that_egp_token(),
        'where': str(where),
        'geometry': str(WA_ENVELOPE),
        'geometryType': 'esriGeometryEnvelope',
        'inSR': '4326',
        'spatialRel': 'esriSpatialRelIntersects',
        'outFields': '*',
        'f': 'geojson',
    }

    s = requests.Session()
    s.headers.update({'referer': referer})
    r = s.post(map_service + "/query?", data=request_params)
    results = r.json()
    return JsonResponse(results, safe=False)
