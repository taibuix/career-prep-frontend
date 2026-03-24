import 'package:flutter/material.dart';

import '../models/app_models.dart';
import '../services/api_client.dart';
import '../services/app_state.dart';
import '../widgets/common.dart';

class InterviewScreen extends StatefulWidget {
  const InterviewScreen({super.key, required this.appState});

  final AppState appState;

  @override
  State<InterviewScreen> createState() => _InterviewScreenState();
}

class _InterviewScreenState extends State<InterviewScreen> {
  final _roleController = TextEditingController(text: 'Frontend Engineer');
  final _companyController = TextEditingController();
  final _answerController = TextEditingController();

  String _interviewType = 'TECHNICAL';
  InterviewAnalytics _analytics = InterviewAnalytics.empty();
  InterviewSession? _session;
  SubmitInterviewAnswerResult? _lastFeedback;
  InterviewOverallFeedback? _overallFeedback;
  int _currentQuestionIndex = 0;
  bool _loadingAnalytics = true;
  bool _creatingSession = false;
  bool _submittingAnswer = false;
  String? _error;
  String? _success;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  @override
  void dispose() {
    _roleController.dispose();
    _companyController.dispose();
    _answerController.dispose();
    super.dispose();
  }

  Future<void> _loadAnalytics() async {
    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      final analytics = await api.getInterviewAnalytics();
      setState(() {
        _analytics = analytics;
      });
    } catch (error) {
      setState(() {
        _error = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _loadingAnalytics = false;
      });
    }
  }

  Future<void> _startSession() async {
    setState(() {
      _creatingSession = true;
      _error = null;
      _success = null;
      _overallFeedback = null;
      _lastFeedback = null;
    });

    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      final session = await api.createInterviewSession(
        role: _roleController.text.trim(),
        interviewType: _interviewType,
      );

      setState(() {
        _session = session;
        _currentQuestionIndex = 0;
        _answerController.clear();
        _success = 'Session ready: ${session.questions.length} questions generated.';
      });
    } catch (error) {
      setState(() {
        _error = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _creatingSession = false;
      });
    }
  }

  Future<void> _submitAnswer() async {
    final question = _session?.questions[_currentQuestionIndex];
    if (question == null || _answerController.text.trim().isEmpty) {
      return;
    }

    setState(() {
      _submittingAnswer = true;
      _error = null;
      _success = null;
    });

    try {
      final api = await ApiClient.create(baseUrl: widget.appState.apiUrl);
      final result = await api.submitInterviewAnswer(
        questionId: question.id,
        answer: _answerController.text.trim(),
      );

      final isLastQuestion = _currentQuestionIndex == (_session!.questions.length - 1);

      setState(() {
        _lastFeedback = result;
        _success = 'Score: ${result.feedback.score.toStringAsFixed(1)}';
        _answerController.clear();
      });

      if (isLastQuestion) {
        setState(() {
          _overallFeedback = result.overallFeedback;
          _session = null;
          _currentQuestionIndex = 0;
        });
        await _loadAnalytics();
      } else {
        setState(() {
          _currentQuestionIndex += 1;
        });
      }
    } catch (error) {
      setState(() {
        _error = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _submittingAnswer = false;
      });
    }
  }

  int _wordCount(String value) {
    final trimmed = value.trim();
    if (trimmed.isEmpty) {
      return 0;
    }
    return trimmed.split(RegExp(r'\s+')).length;
  }

  @override
  Widget build(BuildContext context) {
    final currentQuestion =
        _session != null ? _session!.questions[_currentQuestionIndex] : null;

    return AppScaffold(
      title: 'Interview Coach',
      child: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
        children: <Widget>[
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: <Widget>[
                    InfoChip(label: 'AI Interview Coach', icon: Icons.auto_awesome_rounded),
                    InfoChip(
                      label: 'STAR format',
                      icon: Icons.track_changes_rounded,
                      color: Color(0xFF10B981),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Interview Practice Studio',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Simulate realistic interviews, capture response quality, and improve with targeted feedback loops.',
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
                  'Session Setup',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: _roleController,
                  decoration: const InputDecoration(labelText: 'Target role'),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _companyController,
                  decoration: const InputDecoration(labelText: 'Company (optional)'),
                ),
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  value: _interviewType,
                  items: const <DropdownMenuItem<String>>[
                    DropdownMenuItem(value: 'TECHNICAL', child: Text('Technical')),
                    DropdownMenuItem(value: 'BEHAVIORAL', child: Text('Behavioral')),
                    DropdownMenuItem(value: 'MIXED', child: Text('Mixed')),
                  ],
                  onChanged: (value) => setState(() => _interviewType = value ?? 'TECHNICAL'),
                  decoration: const InputDecoration(labelText: 'Interview type'),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _creatingSession ? null : _startSession,
                    child: Text(_creatingSession ? 'Starting...' : 'Start Session'),
                  ),
                ),
              ],
            ),
          ),
          if (_success != null) ...<Widget>[
            const SizedBox(height: 16),
            _MessageCard(
              text: _success!,
              background: const Color(0xFFDCFCE7),
              foreground: const Color(0xFF166534),
            ),
          ],
          if (_error != null) ...<Widget>[
            const SizedBox(height: 16),
            _MessageCard(
              text: _error!,
              background: const Color(0xFFFEE2E2),
              foreground: const Color(0xFFB91C1C),
            ),
          ],
          const SizedBox(height: 18),
          if (currentQuestion != null) ...<Widget>[
            SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'Question ${_currentQuestionIndex + 1} of ${_session!.questions.length}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    currentQuestion.question,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _answerController,
                    minLines: 6,
                    maxLines: 9,
                    decoration: const InputDecoration(
                      hintText: 'Draft your answer using STAR: Situation, Task, Action, Result.',
                    ),
                    onChanged: (_) => setState(() {}),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      Text('Word count: ${_wordCount(_answerController.text)}'),
                      ElevatedButton(
                        onPressed: _submittingAnswer ? null : _submitAnswer,
                        child: Text(_submittingAnswer ? 'Submitting...' : 'Submit'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ] else ...<Widget>[
            SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const <Widget>[
                  Text(
                    'How it works',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                  SizedBox(height: 12),
                  Text('1. Pick your target role and interview type.'),
                  Text('2. Start a session to generate tailored questions.'),
                  Text('3. Answer each prompt and review AI feedback.'),
                  Text('4. Track your performance in the analytics snapshot below.'),
                ],
              ),
            ),
          ],
          if (_lastFeedback != null) ...<Widget>[
            const SizedBox(height: 18),
            SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'Latest AI Feedback',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Score: ${_lastFeedback!.feedback.score.toStringAsFixed(1)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF059669),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Strengths',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _lastFeedback!.feedback.strengths.isEmpty
                        ? 'No strengths provided.'
                        : _lastFeedback!.feedback.strengths,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Improvements',
                    style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _lastFeedback!.feedback.improvements.isEmpty
                        ? 'No improvements provided.'
                        : _lastFeedback!.feedback.improvements,
                  ),
                ],
              ),
            ),
          ],
          if (_overallFeedback != null) ...<Widget>[
            const SizedBox(height: 18),
            SectionCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'Session Wrap-Up',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w800,
                        ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Overall score: ${_overallFeedback!.overallScore.toStringAsFixed(1)}',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Text(_overallFeedback!.summary),
                  const SizedBox(height: 12),
                  const Text('Top strengths', style: TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 6),
                  ..._overallFeedback!.topStrengths.map((item) => Text('• $item')),
                  const SizedBox(height: 10),
                  const Text('Focus areas', style: TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 6),
                  ..._overallFeedback!.focusAreas.map((item) => Text('• $item')),
                ],
              ),
            ),
          ],
          const SizedBox(height: 18),
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'Performance Snapshot',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                if (_loadingAnalytics)
                  const Center(child: CircularProgressIndicator())
                else
                  Row(
                    children: <Widget>[
                      _StatBlock(
                        label: 'Sessions',
                        value: '${_analytics.completedSessions}',
                        color: const Color(0xFF10B981),
                      ),
                      const SizedBox(width: 10),
                      _StatBlock(
                        label: 'Best score',
                        value: _analytics.bestScore.toStringAsFixed(0),
                        color: const Color(0xFF0EA5E9),
                      ),
                      const SizedBox(width: 10),
                      _StatBlock(
                        label: 'Avg score',
                        value: _analytics.averageScore.toStringAsFixed(1),
                        color: const Color(0xFFF59E0B),
                      ),
                    ],
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatBlock extends StatelessWidget {
  const _StatBlock({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          children: <Widget>[
            Text(
              value,
              style: TextStyle(
                color: color,
                fontSize: 22,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _MessageCard extends StatelessWidget {
  const _MessageCard({
    required this.text,
    required this.background,
    required this.foreground,
  });

  final String text;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Text(text, style: TextStyle(color: foreground)),
    );
  }
}
