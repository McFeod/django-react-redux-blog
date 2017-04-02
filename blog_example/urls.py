from django.conf.urls import url, include
from django.contrib import admin

from blog.api import get_api_urls

urlpatterns = [
    url(r'^admin/', admin.site.urls, name='admin'),
    url(r'^api/', include(get_api_urls())),
    url(r'^accounts/', include('registration.backends.simple.urls', namespace='auth')),
    url(r'^', include('blog.urls', namespace='blog'))
]
