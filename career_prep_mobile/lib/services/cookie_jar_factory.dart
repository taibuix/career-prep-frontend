import 'package:cookie_jar/cookie_jar.dart';

import 'cookie_jar_factory_io.dart';

Future<CookieJar> createCookieJar() => createPlatformCookieJar();
