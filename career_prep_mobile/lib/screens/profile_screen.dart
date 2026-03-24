import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key, required this.appState});

  final AppState appState;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _bioController;

  late String _targetRole;
  late String _experienceLevel;
  bool _saving = false;
  String? _status;
  String? _error;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.appState.user?.name ?? '');
    _emailController = TextEditingController(text: widget.appState.user?.email ?? '');
    _bioController = TextEditingController(text: widget.appState.profilePreferences.bio);
    _targetRole = widget.appState.profilePreferences.targetRole;
    _experienceLevel = widget.appState.profilePreferences.experienceLevel;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    setState(() {
      _saving = true;
      _error = null;
      _status = null;
    });

    try {
      await widget.appState.updateProfile(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        preferences: ProfilePreferences(
          targetRole: _targetRole,
          experienceLevel: _experienceLevel,
          bio: _bioController.text.trim(),
        ),
      );

      setState(() {
        _status = 'Profile changes saved.';
      });
    } catch (error) {
      setState(() {
        _error = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _saving = false;
      });
    }
  }

  String _formatSlug(String value) {
    return value
        .split('-')
        .map((word) => word.isEmpty ? word : '${word[0].toUpperCase()}${word.substring(1)}')
        .join(' ');
  }

  @override
  Widget build(BuildContext context) {
    final completion = _bioController.text.trim().isEmpty ? 0.75 : 1.0;

    return AppScaffold(
      title: 'Profile',
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: <Widget>[
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Personalize your prep profile',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Keep your role focus and experience context updated to get better interview and resume suggestions.',
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Basic Information',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Full name'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _targetRole,
                  items: const <DropdownMenuItem<String>>[
                    DropdownMenuItem(value: 'frontend-engineer', child: Text('Frontend Engineer')),
                    DropdownMenuItem(value: 'backend-engineer', child: Text('Backend Engineer')),
                    DropdownMenuItem(value: 'fullstack-engineer', child: Text('Fullstack Engineer')),
                    DropdownMenuItem(value: 'product-manager', child: Text('Product Manager')),
                  ],
                  onChanged: (value) => setState(() => _targetRole = value ?? _targetRole),
                  decoration: const InputDecoration(labelText: 'Target role'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _experienceLevel,
                  items: const <DropdownMenuItem<String>>[
                    DropdownMenuItem(value: 'internship', child: Text('Internship')),
                    DropdownMenuItem(value: 'entry-level', child: Text('Entry level')),
                    DropdownMenuItem(value: 'mid-level', child: Text('Mid level')),
                    DropdownMenuItem(value: 'senior-level', child: Text('Senior level')),
                  ],
                  onChanged: (value) =>
                      setState(() => _experienceLevel = value ?? _experienceLevel),
                  decoration: const InputDecoration(labelText: 'Experience level'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _bioController,
                  minLines: 4,
                  maxLines: 6,
                  onChanged: (_) => setState(() {}),
                  decoration: const InputDecoration(
                    labelText: 'Career bio',
                    hintText:
                        'Write 3-5 lines about your strengths, goals, and recent achievements.',
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _saving ? null : _save,
                    child: Text(_saving ? 'Saving...' : 'Save Profile'),
                  ),
                ),
                if (_status != null) ...<Widget>[
                  const SizedBox(height: 10),
                  Text(_status!, style: const TextStyle(color: Color(0xFF166534))),
                ],
                if (_error != null) ...<Widget>[
                  const SizedBox(height: 10),
                  Text(_error!, style: const TextStyle(color: Color(0xFFB91C1C))),
                ],
              ],
            ),
          ),
          const SizedBox(height: 18),
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Profile Summary',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFFEF3C7),
                    child: Icon(Icons.work_rounded, color: Color(0xFFD97706)),
                  ),
                  title: const Text('Focus'),
                  subtitle: Text(_formatSlug(_targetRole)),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFDBEAFE),
                    child: Icon(Icons.trending_up_rounded, color: Color(0xFF2563EB)),
                  ),
                  title: const Text('Experience level'),
                  subtitle: Text(_formatSlug(_experienceLevel)),
                ),
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const CircleAvatar(
                    backgroundColor: Color(0xFFDCFCE7),
                    child: Icon(Icons.task_alt_rounded, color: Color(0xFF059669)),
                  ),
                  title: const Text('Profile completion'),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text('${(completion * 100).round()}% complete'),
                      const SizedBox(height: 6),
                      LinearProgressIndicator(value: completion, minHeight: 8),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
