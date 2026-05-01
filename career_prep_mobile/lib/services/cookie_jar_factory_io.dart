import 'dart:io';

import 'package:cookie_jar/cookie_jar.dart';
import 'package:path_provider/path_provider.dart';

Future<CookieJar> createPlatformCookieJar() async {
  final directory = await getApplicationDocumentsDirectory();
  final cookieDirectory = Directory('${directory.path}/career-prep-cookies');

  return PersistCookieJar(
    storage: FileStorage(cookieDirectory.path),
    ignoreExpires: false,
  );
}
