import 'package:flutter/material.dart';

import '../services/app_state.dart';
import '../widgets/common.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key, required this.appState});

  final AppState appState;

  static const List<Map<String, String>> _weeklyTasks = <Map<String, String>>[
    <String, String>{'label': 'Finish one behavioral session', 'done': 'true'},
    <String, String>{'label': 'Update resume bullets with impact', 'done': 'true'},
    <String, String>{'label': 'Apply to 3 target roles', 'done': 'false'},
    <String, String>{'label': 'Review project highlights', 'done': 'false'},
  ];

  static const List<Map<String, dynamic>> _stats = <Map<String, dynamic>>[
    <String, dynamic>{
      'title': 'Interviews this week',
      'value': '3',
      'sub': '1 completed · 2 active',
      'color': Color(0xFF0EA5E9),
    },
    <String, dynamic>{
      'title': 'Resume score',
      'value': '81%',
      'sub': 'Up 5% from last week',
      'color': Color(0xFF10B981),
    },
    <String, dynamic>{
      'title': 'Weekly goal',
      'value': '6/10',
      'sub': 'Tasks completed this week',
      'color': Color(0xFFF59E0B),
    },
  ];

  @override
  Widget build(BuildContext context) {
    final name = appState.user?.name.split(' ').first ?? 'there';

    return AppScaffold(
      title: 'Dashboard',
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: <Widget>[
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              gradient: const LinearGradient(
                colors: <Color>[
                  Color(0xFFECFEFF),
                  Color(0xFFF0FDF4),
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                const Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: <Widget>[
                    InfoChip(
                      label: '7-day streak',
                      icon: Icons.local_fire_department_rounded,
                      color: Color(0xFFF59E0B),
                    ),
                    InfoChip(
                      label: '+12% score improvement',
                      icon: Icons.trending_up_rounded,
                      color: Color(0xFF0EA5E9),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Welcome back, $name.',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Track your interview, resume, and application progress in one mobile command center.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: const Color(0xFF475569),
                      ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
          ..._stats.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: SectionCard(
                child: Row(
                  children: <Widget>[
                    Container(
                      height: 52,
                      width: 52,
                      decoration: BoxDecoration(
                        color: (item['color'] as Color).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(Icons.insights_rounded, color: item['color'] as Color),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            item['title'] as String,
                            style: const TextStyle(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item['sub'] as String,
                            style: const TextStyle(color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      item['value'] as String,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.w800,
                          ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          SectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  "This Week's Plan",
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                ..._weeklyTasks.map(
                  (task) {
                    final done = task['done'] == 'true';
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Icon(
                            done
                                ? Icons.check_circle_rounded
                                : Icons.radio_button_unchecked_rounded,
                            color: done
                                ? const Color(0xFF10B981)
                                : const Color(0xFF94A3B8),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              task['label']!,
                              style: TextStyle(
                                color: done
                                    ? const Color(0xFF64748B)
                                    : const Color(0xFF0F172A),
                                decoration: done ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
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
                  'Recent Activity',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 14),
                ...const <Map<String, String>>[
                  <String, String>{
                    'label': 'Technical interview',
                    'sub': 'Score: 87 · 42 min ago',
                  },
                  <String, String>{
                    'label': 'Resume updated',
                    'sub': 'Summary section · 2 days ago',
                  },
                  <String, String>{
                    'label': 'Job application',
                    'sub': 'Applied to Stripe · 5 days ago',
                  },
                ].map(
                  (item) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFFE0F2FE),
                      child: Icon(Icons.bolt_rounded, color: Color(0xFF0284C7)),
                    ),
                    title: Text(
                      item['label']!,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                    ),
                    subtitle: Text(
                      item['sub']!,
                      style: const TextStyle(color: Color(0xFF64748B)),
                    ),
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
