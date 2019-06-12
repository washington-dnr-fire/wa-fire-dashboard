from django.http import HttpResponse
from django.template import loader
from .models import IntelReport

# Create your views here.
def index(request):
    template = loader.get_template('fire_intel/index.html')
    if IntelReport.objects.count() > 0:
        latest_intel_report = IntelReport.objects.latest("date_of_report")
        updated_date_txt = latest_intel_report.date_of_report.strftime("%m/%d/%Y, %H:%M:%S")
        context = {
        'preparedness_level_national':latest_intel_report.preparedness_level_national,
        'preparedness_level_nw':latest_intel_report.preparedness_level_nw,
        'type_1_teams_assigned':latest_intel_report.type_1_teams_assigned,
        'type_2_teams_assigned':latest_intel_report.type_2_teams_assigned,
        'wa_large_fires':latest_intel_report.wa_large_fires,
        'dnr_ia_fires':latest_intel_report.dnr_ia_fires,
        'ne_committed_engines':latest_intel_report.ne_committed_engines,
        'ne_committed_crews':latest_intel_report.ne_committed_crews,
        'ne_available_engines':latest_intel_report.ne_available_engines,
        'ne_available_crews':latest_intel_report.ne_available_crews,
        'se_committed_engines':latest_intel_report.se_committed_engines,
        'se_committed_crews':latest_intel_report.se_committed_crews,
        'se_available_engines':latest_intel_report.se_available_engines,
        'se_available_crews':latest_intel_report.se_available_crews,
        'nw_committed_engines':latest_intel_report.nw_committed_engines,
        'nw_committed_crews':latest_intel_report.nw_committed_crews,
        'nw_available_engines':latest_intel_report.nw_available_engines,
        'nw_available_crews':latest_intel_report.nw_available_crews,
        'pc_committed_engines':latest_intel_report.pc_committed_engines,
        'pc_committed_crews':latest_intel_report.pc_committed_crews,
        'pc_available_engines':latest_intel_report.pc_available_engines,
        'pc_available_crews':latest_intel_report.pc_available_crews,
        'oly_committed_engines':latest_intel_report.oly_committed_engines,
        'oly_committed_crews':latest_intel_report.oly_committed_crews,
        'oly_available_engines':latest_intel_report.oly_available_engines,
        'oly_available_crews':latest_intel_report.oly_available_crews,
        'sps_committed_engines':latest_intel_report.sps_committed_engines,
        'sps_committed_crews':latest_intel_report.sps_committed_crews,
        'sps_available_engines':latest_intel_report.sps_available_engines,
        'sps_available_crews':latest_intel_report.sps_available_crews,
        'westside_rotors':latest_intel_report.westside_rotors,
        'westside_firebosses':latest_intel_report.westside_firebosses,
        'westside_vlat':latest_intel_report.westside_vlat,
        'westside_ang':latest_intel_report.westside_ang,
        'eastside_rotors':latest_intel_report.eastside_rotors,
        'eastside_firebosses':latest_intel_report.eastside_firebosses,
        'eastside_vlat':latest_intel_report.eastside_vlat,
        'eastside_ang':latest_intel_report.eastside_ang,
        'in_region_rotors':latest_intel_report.in_region_rotors,
        'in_region_firebosses':latest_intel_report.in_region_firebosses,
        'in_region_vlat':latest_intel_report.in_region_vlat,
        'in_region_ang':latest_intel_report.in_region_ang,
        'updated_date_txt': updated_date_txt,
    }
    else:
        context = {
        'preparedness_level_national':0,
        'preparedness_level_nw':0,
        'type_1_teams_assigned':0,
        'type_2_teams_assigned':0,
        'wa_large_fires':0,
        'dnr_ia_fires':0,
        'ne_committed_engines':0,
        'ne_committed_crews':0,
        'ne_available_engines':0,
        'ne_available_crews':0,
        'se_committed_engines':0,
        'se_committed_crews':0,
        'se_available_engines':0,
        'se_available_crews':0,
        'nw_committed_engines':0,
        'nw_committed_crews':0,
        'nw_available_engines':0,
        'nw_available_crews':0,
        'pc_committed_engines':0,
        'pc_committed_crews':0,
        'pc_available_engines':0,
        'pc_available_crews':0,
        'oly_committed_engines':0,
        'oly_committed_crews':0,
        'oly_available_engines':0,
        'oly_available_crews':0,
        'sps_committed_engines':0,
        'sps_committed_crews':0,
        'sps_available_engines':0,
        'sps_available_crews':0,
        'westside_rotors':0,
        'westside_firebosses':0,
        'westside_vlat':0,
        'westside_ang':0,
        'eastside_rotors':0,
        'eastside_firebosses':0,
        'eastside_vlat':0,
        'eastside_ang':0,
        'in_region_rotors':0,
        'in_region_firebosses':0,
        'in_region_vlat':0,
        'in_region_ang':0,
        'updated_date_txt': "No reports available",
    }
    return HttpResponse(template.render(context, request))

def profile(request):
    template = loader.get_template('fire_intel/profile.html')
    if IntelReport.objects.count() > 0:
        latest_intel_report = IntelReport.objects.latest("date_of_report")
        updated_date_txt = latest_intel_report.date_of_report.strftime("%m/%d/%Y, %H:%M:%S")
    else:
        updated_date_txt = "No reports available"
    if request.user.is_authenticated:
        user = request.user.username
        first_name = request.user.first_name
        last_name = request.user.last_name
        email = request.user.email
        context = {
            'username':user,
            'first_name':first_name,
            'last_name':last_name,
            'email':email,
            'updated_date_txt': updated_date_txt,
        }
        return HttpResponse(template.render(context, request))
    else:
        context = {
            'updated_date_txt': updated_date_txt,
        }
        return HttpResponse(template.render(context, request))
