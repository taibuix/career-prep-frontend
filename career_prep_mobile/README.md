# Career Prep Mobile

Flutter mobile client for the Career Prep application in this repository.

## What It Includes

- Landing, login, and registration flows
- Authenticated mobile shell with bottom navigation
- Dashboard overview
- Resume builder with save/load support against the existing backend
- Interview practice flow with analytics and AI feedback
- Profile editing with local prep preferences

## Project Notes

This project is trimmed down for Android Play Store publishing.
It keeps the Android project, Flutter source, assets, and signing configuration.

## Backend Configuration

The app currently uses the default base URL from [api_client.dart](C:\Users\Tai\Code\career-prep-app\career_prep_mobile\lib\services\api_client.dart):

```text
http://3.144.30.109:5000/api
```

That points to your EC2 backend server.

If you are using:

- a different backend later: update the same constant in `api_client.dart`

## Play Store Release

Build the Android App Bundle from this folder:

```bash
flutter build appbundle
```

The upload file will be:

```text
build/app/outputs/bundle/release/app-release.aab
```

## Main Files

```text
lib/
  main.dart
  models/app_models.dart
  services/api_client.dart
  services/app_state.dart
  screens/
    landing_screen.dart
    auth_screen.dart
    shell_screen.dart
    dashboard_screen.dart
    resume_screen.dart
    interview_screen.dart
    profile_screen.dart
  widgets/common.dart
```
