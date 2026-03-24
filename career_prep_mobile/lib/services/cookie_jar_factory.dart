import 'package:cookie_jar/cookie_jar.dart';

import 'cookie_jar_factory_io.dart'
    if (dart.library.js_interop) 'cookie_jar_factory_web.dart';

Future<CookieJar> createCookieJar() => createPlatformCookieJar();
