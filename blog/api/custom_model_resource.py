from tastypie.resources import ModelResource


class CustomModelResource(ModelResource):
    """
    Tastypie ModelResource, modified to use in usual view
    """
    def get_list_context(self, request):
        request_bundle = self.build_bundle(request=request)
        queryset = self.obj_get_list(request_bundle)
        bundles = [self.full_dehydrate(
            self.build_bundle(obj=obj, request=request),
            for_list=True) for obj in queryset]
        return [x.data for x in bundles]
