from django.contrib.auth.models import User
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import ReadOnlyAuthorization
from tastypie.constants import ALL_WITH_RELATIONS
from tastypie.fields import ToOneField

from blog.api.custom_model_resource import CustomModelResource
from blog.models import Article, Comment


class UserResource(CustomModelResource):
    class Meta:
        resource_name = 'users'
        queryset = User.objects.all()
        fields = ['username', 'first_name', 'last_name', 'id']


class ArticleResource(CustomModelResource):
    author = ToOneField(UserResource, attribute='author', full=True)

    def dehydrate(self, bundle):
        bundle.data['comment_count'] = bundle.obj.comment_set.count()
        return bundle

    class Meta:
        resource_name = 'articles'
        queryset = Article.objects.all()


class CommentAuthorization(ReadOnlyAuthorization):
    def create_detail(self, object_list, bundle):
        return True


class CommentResource(CustomModelResource):

    article = ToOneField(ArticleResource, attribute='article', full=False)
    max_unfold_comment = ToOneField('blog.api.resources.CommentResource', attribute='max_unfold_comment', full=False)
    author = ToOneField(UserResource, attribute='author', full=True)

    def hydrate(self, bundle):
        bundle.obj.author = bundle.request.user
        bundle.obj.article = Article.objects.get(id=int(bundle.data['article']))
        bundle.obj.parent_comment = None if bundle.data['parent_comment'] is None else (
            Comment.objects.get(id=int(bundle.data['parent_comment']))
        )
        return bundle

    def dehydrate(self, bundle):
        bundle.data['parent_comment'] = bundle.obj.parent_comment.id if bundle.obj.parent_comment else None
        bundle.data['max_unfold_comment'] = bundle.obj.max_unfold_comment.id
        bundle.data['has_children'] = bundle.obj.children.exists()
        return bundle

    class Meta:
        resource_name = 'comments'
        always_return_data = True
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get']
        authorization = CommentAuthorization()
        authentication = SessionAuthentication()
        queryset = Comment.objects.all()
        filtering = {
            'article': ALL_WITH_RELATIONS,
            'parent_comment':  ALL_WITH_RELATIONS,
            'level': ALL_WITH_RELATIONS,
            'max_unfold_comment': ALL_WITH_RELATIONS
        }

