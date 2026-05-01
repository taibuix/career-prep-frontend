import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../services/api_client.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';

class ResumeScreen extends StatefulWidget {
  const ResumeScreen({super.key, required this.appState});

  final AppState appState;

  @override
  State<ResumeScreen> createState() => _ResumeScreenState();
}

class _ResumeScreenState extends State<ResumeScreen> {
  static const Map<String, Map<String, Object>> _sectionMeta = <String, Map<String, Object>>{
    'summary': <String, Object>{
      'title': 'Professional Summary',
      'type': 'OTHER',
      'kind': 'SUMMARY',
      'order': 2,
      'placeholder':
          'Product-minded frontend engineer with 5+ years building performant, accessible user experiences.',
    },
    'experience': <String, Object>{
      'title': 'Experience Highlights',
      'type': 'EXPERIENCE',
      'kind': 'EXPERIENCE',
      'order': 3,
      'placeholder':
          '- Reduced checkout abandonment by 18% by redesigning mobile payment steps.',
    },
    'skills': <String, Object>{
      'title': 'Core Skills',
      'type': 'SKILLS',
      'kind': 'SKILLS',
      'order': 4,
      'placeholder': 'React\nTypeScript\nNext.js\nDesign systems',
    },
    'projects': <String, Object>{
      'title': 'Projects',
      'type': 'PROJECT',
      'kind': 'PROJECT',
      'order': 5,
      'placeholder':
          'Career Prep App - Built a role-specific resume and interview prep platform.',
    },
    'education': <String, Object>{
      'title': 'Education',
      'type': 'EDUCATION',
      'kind': 'EDUCATION',
      'order': 6,
      'placeholder': 'B.S. Computer Science - University of Washington',
    },
  };

  final _fullNameController = TextEditingController();
  final _targetRoleController = TextEditingController(text: 'Frontend Engineer');
  final _targetCompanyController = TextEditingController();

  final Map<String, TextEditingController> _sectionControllers = <String, TextEditingController>{
    'summary': TextEditingController(),
    'experience': TextEditingController(),
    'skills': TextEditingController(),
    'projects': TextEditingController(),
    'education': TextEditingController(),
  };

  final Map<String, String?> _sectionIds = <String, String?>{
    'summary': null,
    'experience': null,
    'skills': null,
    'projects': null,
    'education': null,
  };

  final List<String> _keywordSuggestions = const <String>[
    'Cross-functional collaboration',
    'Performance optimization',
    'Design systems',
    'Stakeholder communication',
    'Product analytics',
    'Experimentation',
  ];

  bool _loading = true;
  bool _saving = false;
  bool _analyzing = false;
  String _template = 'modern';
  String? _resumeId;
  String? _setupSectionId;
  String? _statusMessage;
  String? _errorMessage;
  ResumeFeedback? _feedback;

  @override
  void initState() {
    super.initState();
    _fullNameController.text = widget.appState.user?.name ?? '';
    _loadResume();
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _targetRoleController.dispose();
    _targetCompanyController.dispose();
    for (final controller in _sectionControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> _loadResume() async {
    setState(() {
      _loading = true;
      _errorMessage = null;
      _statusMessage = null;
    });

    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      final resumes = await api.getUserResumes();
      if (resumes.isEmpty) {
        setState(() {
          _statusMessage = 'No saved resume yet. Start building and save when ready.';
        });
        return;
      }

      final detail = await api.getResumeById(resumes.first.id);
      _resumeId = detail.id;

      for (final section in detail.resumeSections) {
        if (section.type == 'OTHER' &&
            section.content is Map<String, dynamic> &&
            section.content['kind'] == 'SETUP') {
          final payload =
              section.content['payload'] as Map<String, dynamic>? ?? <String, dynamic>{};
          _fullNameController.text =
              payload['fullName'] as String? ?? _fullNameController.text;
          _targetRoleController.text =
              payload['targetRole'] as String? ?? _targetRoleController.text;
          _targetCompanyController.text = payload['targetCompany'] as String? ?? '';
          _template = payload['template'] as String? ?? _template;
          _setupSectionId = section.id;
          continue;
        }

        final key = _keyForSection(section);
        if (key == null) {
          continue;
        }

        _sectionIds[key] = section.id;
        _sectionControllers[key]!.text = _readSectionText(section.content);
      }

      setState(() {
        _statusMessage = 'Loaded your latest saved resume.';
      });
    } catch (error) {
      setState(() {
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  String? _keyForSection(ResumeSection section) {
    if (section.type == 'EXPERIENCE') return 'experience';
    if (section.type == 'SKILLS') return 'skills';
    if (section.type == 'PROJECT') return 'projects';
    if (section.type == 'EDUCATION') return 'education';

    if (section.type == 'OTHER' &&
        section.content is Map<String, dynamic> &&
        section.content['kind'] == 'SUMMARY') {
      return 'summary';
    }

    return null;
  }

  String _readSectionText(dynamic content) {
    if (content is String) {
      return content;
    }
    if (content is Map<String, dynamic>) {
      final text = content['text'];
      if (text is String) {
        return text;
      }
    }
    return '';
  }

  int _countWords(String value) {
    final trimmed = value.trim();
    if (trimmed.isEmpty) {
      return 0;
    }
    return trimmed.split(RegExp(r'\s+')).length;
  }

  List<String> _splitLines(String value) {
    return value
        .split('\n')
        .map((line) => line.trim())
        .where((line) => line.isNotEmpty)
        .toList();
  }

  int _atsScore() {
    var score = 20;
    if (_fullNameController.text.trim().isNotEmpty) score += 10;
    if (_targetRoleController.text.trim().isNotEmpty) score += 10;
    if (_sectionControllers['summary']!.text.trim().isNotEmpty) score += 20;
    if (_splitLines(_sectionControllers['experience']!.text).length >= 2) score += 20;
    if (_splitLines(_sectionControllers['skills']!.text).length >= 5) score += 15;
    if (_splitLines(_sectionControllers['projects']!.text).isNotEmpty) score += 10;
    if (_splitLines(_sectionControllers['education']!.text).isNotEmpty) score += 5;
    return score > 100 ? 100 : score;
  }

  Future<void> _analyzeResume() async {
    if (_resumeId == null) {
      setState(() {
        _errorMessage = 'Save your resume first before analyzing.';
      });
      return;
    }

    setState(() {
      _analyzing = true;
      _errorMessage = null;
      _statusMessage = null;
    });

    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      final feedback = await api.analyzeResume(_resumeId!);
      setState(() {
        _feedback = feedback;
        _statusMessage = 'AI analysis complete.';
      });
    } catch (error) {
      setState(() {
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _analyzing = false;
      });
    }
  }

  Future<void> _saveResume() async {
    setState(() {
      _saving = true;
      _errorMessage = null;
      _statusMessage = null;
    });

    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      var activeResumeId = _resumeId;

      if (activeResumeId == null) {
        final created = await api.createResume(
          _targetCompanyController.text.trim().isEmpty
              ? _targetRoleController.text.trim()
              : '${_targetRoleController.text.trim()} - ${_targetCompanyController.text.trim()}',
        );
        activeResumeId = created.id;
        _resumeId = created.id;
      }

      final setupPayload = <String, dynamic>{
        'kind': 'SETUP',
        'payload': <String, dynamic>{
          'fullName': _fullNameController.text.trim(),
          'targetRole': _targetRoleController.text.trim(),
          'targetCompany': _targetCompanyController.text.trim(),
          'template': _template,
        },
      };

      if (_setupSectionId == null) {
        final created = await api.createResumeSection(
          resumeId: activeResumeId,
          type: 'OTHER',
          order: 1,
          content: setupPayload,
        );
        _setupSectionId = created.id;
      } else {
        await api.updateResumeSection(sectionId: _setupSectionId!, content: setupPayload);
      }

      for (final entry in _sectionControllers.entries) {
        final meta = _sectionMeta[entry.key]!;
        final payload = entry.key == 'summary'
            ? <String, dynamic>{
                'kind': meta['kind'] as String,
                'text': entry.value.text.trim(),
              }
            : <String, dynamic>{
                'kind': meta['kind'] as String,
                'text': entry.value.text.trim(),
                'items': _splitLines(entry.value.text),
              };

        if (_sectionIds[entry.key] == null) {
          final created = await api.createResumeSection(
            resumeId: activeResumeId,
            type: meta['type'] as String,
            order: meta['order'] as int,
            content: payload,
          );
          _sectionIds[entry.key] = created.id;
        } else {
          await api.updateResumeSection(sectionId: _sectionIds[entry.key]!, content: payload);
        }
      }

      setState(() {
        _statusMessage = 'Resume saved successfully.';
      });
    } catch (error) {
      setState(() {
        _errorMessage = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _saving = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final summaryWordCount = _countWords(_sectionControllers['summary']!.text);
    final experienceItems = _splitLines(_sectionControllers['experience']!.text);
    final skillsItems = _splitLines(_sectionControllers['skills']!.text);
    final projectItems = _splitLines(_sectionControllers['projects']!.text);
    final educationItems = _splitLines(_sectionControllers['education']!.text);
    final atsScore = _atsScore();
    final combinedKeywords =
        '${_sectionControllers['summary']!.text}\n${_sectionControllers['experience']!.text}\n${_sectionControllers['skills']!.text}'
            .toLowerCase();

    return AppScaffold(
      title: 'Resume Builder',
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: <Widget>[
          FloatingActionButton.extended(
            heroTag: 'analyze',
            onPressed: _analyzing ? null : _analyzeResume,
            icon: _analyzing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Icon(Icons.auto_awesome_rounded),
            label: Text(_analyzing ? 'Analyzing...' : 'AI Analysis'),
            backgroundColor: const Color(0xFF7C3AED),
          ),
          const SizedBox(height: 10),
          FloatingActionButton.extended(
            heroTag: 'save',
            onPressed: _saving ? null : _saveResume,
            icon: const Icon(Icons.save_rounded),
            label: Text(_saving ? 'Saving...' : 'Save'),
          ),
        ],
      ),
      child: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
              children: <Widget>[
                if (_statusMessage != null)
                  _BannerMessage(
                    text: _statusMessage!,
                    background: const Color(0xFFDCFCE7),
                    foreground: const Color(0xFF166534),
                  ),
                if (_errorMessage != null)
                  _BannerMessage(
                    text: _errorMessage!,
                    background: const Color(0xFFFEE2E2),
                    foreground: const Color(0xFFB91C1C),
                  ),
                SectionCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Resume Setup',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                            ),
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: _fullNameController,
                        decoration: const InputDecoration(labelText: 'Full name'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _targetRoleController,
                        decoration: const InputDecoration(labelText: 'Target role'),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _targetCompanyController,
                        decoration: const InputDecoration(labelText: 'Target company'),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: _template,
                        items: const <DropdownMenuItem<String>>[
                          DropdownMenuItem(value: 'modern', child: Text('Modern')),
                          DropdownMenuItem(value: 'minimal', child: Text('Minimal')),
                          DropdownMenuItem(value: 'classic', child: Text('Classic')),
                        ],
                        onChanged: (value) => setState(() => _template = value ?? 'modern'),
                        decoration: const InputDecoration(labelText: 'Template'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                ..._sectionMeta.entries.map(
                  (entry) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: SectionCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            entry.value['title'] as String,
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w800,
                                ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _sectionControllers[entry.key],
                            minLines: entry.key == 'summary' ? 4 : 5,
                            maxLines: entry.key == 'summary' ? 6 : 8,
                            decoration: InputDecoration(
                              hintText: entry.value['placeholder'] as String,
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                SectionCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text(
                            'ATS Match',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w800,
                                ),
                          ),
                          Text(
                            '$atsScore%',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  color: atsScore >= 85
                                      ? const Color(0xFF059669)
                                      : atsScore >= 70
                                          ? const Color(0xFFD97706)
                                          : const Color(0xFFDC2626),
                                  fontWeight: FontWeight.w800,
                                ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text('Summary word count: $summaryWordCount'),
                      Text('Experience bullets: ${experienceItems.length}'),
                      Text('Skills listed: ${skillsItems.length}'),
                      Text('Projects listed: ${projectItems.length}'),
                      Text('Education lines: ${educationItems.length}'),
                      const SizedBox(height: 14),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _keywordSuggestions
                            .map(
                              (keyword) => Chip(
                                label: Text(keyword),
                                backgroundColor:
                                    combinedKeywords.contains(keyword.toLowerCase())
                                        ? const Color(0xFFDCFCE7)
                                        : const Color(0xFFF8FAFC),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
                if (_feedback != null) ...<Widget>[
                  const SizedBox(height: 18),
                  _ResumeFeedbackCard(feedback: _feedback!),
                ],
              ],
            ),
    );
  }
}

class _ResumeFeedbackCard extends StatelessWidget {
  const _ResumeFeedbackCard({required this.feedback});

  final ResumeFeedback feedback;

  @override
  Widget build(BuildContext context) {
    final score = feedback.score.round();
    final scoreColor = score >= 80
        ? const Color(0xFF059669)
        : score >= 60
            ? const Color(0xFFD97706)
            : const Color(0xFFDC2626);

    return SectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Text(
                'AI Feedback',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                    ),
              ),
              Text(
                '$score / 100',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: scoreColor,
                      fontWeight: FontWeight.w800,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(feedback.summary),
          if (feedback.suggestions.isNotEmpty) ...<Widget>[
            const SizedBox(height: 14),
            Text(
              'Suggestions',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 6),
            ...feedback.suggestions.map(
              (s) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Text('• ', style: TextStyle(fontWeight: FontWeight.bold)),
                    Expanded(child: Text(s)),
                  ],
                ),
              ),
            ),
          ],
          if (feedback.sectionTips.isNotEmpty) ...<Widget>[
            const SizedBox(height: 14),
            Text(
              'Section Tips',
              style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 6),
            ...feedback.sectionTips.entries.map(
              (entry) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      entry.key,
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                    ),
                    const SizedBox(height: 2),
                    Text(entry.value, style: const TextStyle(fontSize: 13)),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _BannerMessage extends StatelessWidget {
  const _BannerMessage({
    required this.text,
    required this.background,
    required this.foreground,
  });

  final String text;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Text(text, style: TextStyle(color: foreground)),
      ),
    );
  }
}
