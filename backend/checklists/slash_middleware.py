
from django.http import HttpResponsePermanentRedirect
from django.urls import is_valid_path
from django.utils.deprecation import MiddlewareMixin
from django.utils.http import escape_leading_slashes


class AppendSlashMiddleware(MiddlewareMixin):
    response_redirect_class = HttpResponsePermanentRedirect

    def process_request(self, request):
        redirect_url = ''

        if self.should_redirect_with_slash(request):
            path = self.get_full_path_with_slash(request)
        else:
            path = request.get_full_path()

        if redirect_url or path != request.get_full_path():
            redirect_url += path
            return self.response_redirect_class(redirect_url)

    def should_redirect_with_slash(self, request):
        if request.path_info.endswith('/'):
            return False

        urlconf = getattr(request, 'urlconf', None)
        return (
            not is_valid_path(request.path_info, urlconf) and
            is_valid_path('%s/' % request.path_info, urlconf)
        )

    def get_full_path_with_slash(self, request):
        new_path = request.get_full_path(force_append_slash=True)
        return escape_leading_slashes(new_path)

    def process_response(self, request, response):
        if response.status_code == 404:
            if self.should_redirect_with_slash(request):
                return self.response_redirect_class(
                    self.get_full_path_with_slash(request))

        if not response.streaming and \
                not response.has_header('Content-Length'):
            response['Content-Length'] = str(len(response.content))

        return response
