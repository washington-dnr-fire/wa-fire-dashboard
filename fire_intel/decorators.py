from project_space_crab.settings import IE_BROWSER_REDIRECT_URL
from django.shortcuts import redirect

# ie test decorator
def ie_test_redirect(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user_on_ie:
            return redirect(IE_BROWSER_REDIRECT_URL)
        else:
            return view_func(request, *args, **kwargs)
    return wrapper