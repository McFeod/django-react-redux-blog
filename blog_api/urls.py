import json

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse

from .api import CommentApi


def handle_exceptions(func):
    def wrapper(request, *args, **kwargs):
        try:
            return func(request, *args, **kwargs)
        except json.JSONDecodeError:
            return HttpResponse('Bad request', status=400)
        except ObjectDoesNotExist:
            return HttpResponse('Object not found', status=404)
        except Exception as e:
            return HttpResponse('Server error: {}'.format(e), status=500)
    return wrapper


urlpatterns = [
    url(r'^comments/$', login_required(handle_exceptions(CommentApi.as_view()))),
]
