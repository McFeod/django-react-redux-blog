from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls, name='admin'),
    url(r'^api/v1/', include('blog_api.urls')),
    url(r'^accounts/', include('registration.backends.simple.urls', namespace='auth')),
    url(r'^', include('blog.urls', namespace='blog'))
]
