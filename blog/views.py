from django.contrib.auth.forms import AuthenticationForm

from django.views.generic import TemplateView


class BlogView(TemplateView):
    template_name = 'blog/base.html'

    def get_context_data(self, **kwargs):
        result = {
            'login_form': AuthenticationForm()
        }
        result.update(super().get_context_data(**kwargs))
        return result


class BlogIndex(BlogView):
    template_name = 'blog/index.html'


class BlogEntry(BlogView):
    template_name = 'blog/blog_entry.html'
