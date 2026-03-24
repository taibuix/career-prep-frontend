import 'package:cookie_jar/cookie_jar.dart';

Future<CookieJar> createPlatformCookieJar() async {
  // Browsers manage cookies for us. An in-memory jar avoids filesystem plugins on web.
  return CookieJar(ignoreExpires: false);
}
