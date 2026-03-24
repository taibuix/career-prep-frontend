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

This folder contains the Flutter app source, but the native `android/`, `ios/`, `macos/`, and similar platform folders were not generated in this environment.

To finish bootstrapping locally:

```bash
cd career_prep_mobile
flutter create .
flutter pub get
flutter run
```

## Backend Configuration

The app currently uses the default base URL from [api_client.dart](C:\Users\Tai\Code\career-prep-app\career_prep_mobile\lib\services\api_client.dart):

```text
http://3.144.30.109:5000/api
```

That points to your EC2 backend server.

If you are using:

- a different backend later: update the same constant in `api_client.dart`

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
