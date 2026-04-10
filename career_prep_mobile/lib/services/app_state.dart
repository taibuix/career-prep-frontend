import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/app_models.dart';
import 'api_client.dart';

class AppState extends ChangeNotifier {
  AppState({
    required ApiClient apiClient,
    required SharedPreferences preferences,
  })  : _apiClient = apiClient,
        _preferences = preferences;

  static const String _profileRoleKey = 'career_prep.profile.target_role';
  static const String _profileLevelKey = 'career_prep.profile.experience_level';
  static const String _profileBioKey = 'career_prep.profile.bio';

  final ApiClient _apiClient;
  final SharedPreferences _preferences;

  AppUser? user;
  bool initializing = true;
  bool authBusy = false;
  String? authError;

  ProfilePreferences profilePreferences = ProfilePreferences.defaults();

  String get apiUrl => ApiClient.defaultBaseUrl;
  bool get isAuthenticated => user != null;

  Future<void> initialize() async {
    profilePreferences = ProfilePreferences(
      targetRole: _preferences.getString(_profileRoleKey) ?? ProfilePreferences.defaults().targetRole,
      experienceLevel:
          _preferences.getString(_profileLevelKey) ?? ProfilePreferences.defaults().experienceLevel,
      bio: _preferences.getString(_profileBioKey) ?? ProfilePreferences.defaults().bio,
    );

    try {
      user = await _apiClient.getCurrentUser();
    } catch (_) {
      user = null;
    } finally {
      initializing = false;
      notifyListeners();
    }
  }

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    return _runAuthTask(() async {
      user = await _apiClient.login(email: email, password: password);
    });
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
  }) async {
    return _runAuthTask(() async {
      user = await _apiClient.register(name: name, email: email, password: password);
    });
  }

  Future<void> logout() async {
    try {
      await _apiClient.logout();
    } catch (_) {
      // Clearing local state keeps the app recoverable even if the backend logout request fails.
    }

    user = null;
    authError = null;
    notifyListeners();
  }

  Future<AppUser> updateProfile({
    required String name,
    required String email,
    required ProfilePreferences preferences,
  }) async {
    final updatedUser = await _apiClient.updateCurrentUser(name: name, email: email);
    user = updatedUser;
    profilePreferences = preferences;

    await _preferences.setString(_profileRoleKey, preferences.targetRole);
    await _preferences.setString(_profileLevelKey, preferences.experienceLevel);
    await _preferences.setString(_profileBioKey, preferences.bio);

    notifyListeners();
    return updatedUser;
  }

  Future<bool> _runAuthTask(Future<void> Function() action) async {
    authBusy = true;
    authError = null;
    notifyListeners();

    try {
      await action();
      return true;
    } catch (error) {
      authError = error.toString().replaceFirst('Exception: ', '');
      return false;
    } finally {
      authBusy = false;
      notifyListeners();
    }
  }
}
