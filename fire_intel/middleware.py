from django.http import HttpResponseRedirect

class InternetExplorerCheckMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user_agent = request.META['HTTP_USER_AGENT'].lower()
        if 'trident' in user_agent or 'msie' in user_agent:
            request.user_on_ie = True
        else:
            request.user_on_ie = False
        response = self.get_response(request)
        return response