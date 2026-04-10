# Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Dart/Flutter engine
-keep class com.google.dart.** { *; }
-dontwarn io.flutter.embedding.**

# Keep annotations used by Flutter plugins
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Dio / OkHttp (used under the hood for HTTP)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# cookie_jar / path_provider native interop
-keep class com.example.** { *; }

# Prevent stripping of shared_preferences plugin
-keep class io.flutter.plugins.sharedpreferences.** { *; }
