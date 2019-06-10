from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('fire_intel/index.html')
    context = {
        "hello":"hello",
    }
    return HttpResponse(template.render(context, request))

def profile(request):
    template = loader.get_template('fire_intel/profile.html')
    context = {
        "nothing":"nothing"
    }
    return HttpResponse(template.render(context, request))
