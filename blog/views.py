from django.contrib.auth.forms import AuthenticationForm
from django.http import Http404

from django.views.generic import TemplateView

from blog.api import ArticleResource
from blog.models import Article


class BlogView(TemplateView):
    """
    Basic class for views in this app
    """
    template_name = 'blog/base.html'

    def get_context_data(self, **kwargs):
        result = {
            'login_form': AuthenticationForm()
        }
        result.update(super().get_context_data(**kwargs))
        return result


class BlogIndex(BlogView):
    template_name = 'blog/index.html'

    def get_context_data(self, **kwargs):
        result = {
            'articles': ArticleResource().get_list_context(self.request)
        }
        result.update(super().get_context_data(**kwargs))
        return result


class BlogEntry(BlogView):
    template_name = 'blog/blog_entry.html'

    def get_context_data(self, **kwargs):
        if 'id' in self.kwargs:
            if Article.objects.filter(id=self.kwargs['id']).exists():
                result = {
                    'article': Article.objects.get(id=self.kwargs['id'])
                }
                result.update(super().get_context_data(**kwargs))
                return result
        raise Http404



