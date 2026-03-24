import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';

void attachPlatformCookieHandling(Dio dio, CookieJar cookieJar) {
  // Browsers already manage cookies for same-origin / allowed credentialed requests.
}
