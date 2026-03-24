import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';

import 'dio_cookie_setup_io.dart'
    if (dart.library.js_interop) 'dio_cookie_setup_web.dart';

void attachCookieHandling(Dio dio, CookieJar cookieJar) {
  attachPlatformCookieHandling(dio, cookieJar);
}
