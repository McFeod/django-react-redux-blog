from tastypie.api import Api

from blog.api.resources import ArticleResource, CommentResource


def get_api_urls():
    api = Api(api_name='v1')
    api.register(ArticleResource())
    api.register(CommentResource())
    return api.urls
