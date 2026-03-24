import 'package:flutter/material.dart';

import '../services/app_state.dart';
import 'auth_screen.dart';
import 'dashboard_screen.dart';
import 'interview_screen.dart';
import 'profile_screen.dart';
import 'resume_screen.dart';

class ShellScreen extends StatefulWidget {
  const ShellScreen({super.key, required this.appState});

  final AppState appState;

  @override
  State<ShellScreen> createState() => _ShellScreenState();
}

class _ShellScreenState extends State<ShellScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pages = <Widget>[
      DashboardScreen(appState: widget.appState),
      ResumeScreen(appState: widget.appState),
      InterviewScreen(appState: widget.appState),
      ProfileScreen(appState: widget.appState),
    ];

    return Scaffold(
      body: pages[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const <NavigationDestination>[
          NavigationDestination(icon: Icon(Icons.dashboard_rounded), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.description_rounded), label: 'Resume'),
          NavigationDestination(icon: Icon(Icons.record_voice_over_rounded), label: 'Interview'),
          NavigationDestination(icon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
      floatingActionButton: _selectedIndex == 3
          ? FloatingActionButton.extended(
              onPressed: () async {
                await widget.appState.logout();
                if (!mounted) {
                  return;
                }
                Navigator.of(context).pushNamedAndRemoveUntil(
                  AuthScreen.loginRoute,
                  (route) => false,
                );
              },
              icon: const Icon(Icons.logout_rounded),
              label: const Text('Logout'),
            )
          : null,
    );
  }
}
