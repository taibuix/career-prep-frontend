class AppUser {
  const AppUser({
    required this.id,
    required this.name,
    required this.email,
  });

  final String id;
  final String name;
  final String email;

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
    );
  }
}

class ResumeSummaryItem {
  const ResumeSummaryItem({
    required this.id,
    required this.title,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String title;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory ResumeSummaryItem.fromJson(Map<String, dynamic> json) {
    return ResumeSummaryItem(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? ''),
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? ''),
    );
  }
}

class ResumeSection {
  const ResumeSection({
    required this.id,
    required this.resumeId,
    required this.order,
    required this.type,
    required this.content,
  });

  final String id;
  final String resumeId;
  final int order;
  final String type;
  final dynamic content;

  factory ResumeSection.fromJson(Map<String, dynamic> json) {
    return ResumeSection(
      id: json['id'] as String? ?? '',
      resumeId: json['resumeId'] as String? ?? '',
      order: json['order'] as int? ?? 0,
      type: json['type'] as String? ?? 'OTHER',
      content: json['content'],
    );
  }
}

class ResumeDetail {
  const ResumeDetail({
    required this.id,
    required this.userId,
    required this.title,
    required this.resumeSections,
  });

  final String id;
  final String userId;
  final String title;
  final List<ResumeSection> resumeSections;

  factory ResumeDetail.fromJson(Map<String, dynamic> json) {
    final sections = (json['resumeSections'] as List<dynamic>? ?? <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(ResumeSection.fromJson)
        .toList();

    return ResumeDetail(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      resumeSections: sections,
    );
  }
}

class InterviewQuestion {
  const InterviewQuestion({
    required this.id,
    required this.sessionId,
    required this.question,
  });

  final String id;
  final String sessionId;
  final String question;

  factory InterviewQuestion.fromJson(Map<String, dynamic> json) {
    return InterviewQuestion(
      id: json['id'] as String? ?? '',
      sessionId: json['sessionId'] as String? ?? '',
      question: json['question'] as String? ?? '',
    );
  }
}

class InterviewSession {
  const InterviewSession({
    required this.id,
    required this.role,
    required this.interviewType,
    required this.status,
    required this.questions,
  });

  final String id;
  final String role;
  final String interviewType;
  final String status;
  final List<InterviewQuestion> questions;

  factory InterviewSession.fromJson(Map<String, dynamic> json) {
    final questions = (json['questions'] as List<dynamic>? ?? <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(InterviewQuestion.fromJson)
        .toList();

    return InterviewSession(
      id: json['id'] as String? ?? '',
      role: json['role'] as String? ?? '',
      interviewType: json['interviewType'] as String? ?? 'TECHNICAL',
      status: json['status'] as String? ?? 'IN_PROGRESS',
      questions: questions,
    );
  }
}

class InterviewAnalyticsPoint {
  const InterviewAnalyticsPoint({
    required this.date,
    required this.score,
  });

  final String? date;
  final double? score;

  factory InterviewAnalyticsPoint.fromJson(Map<String, dynamic> json) {
    return InterviewAnalyticsPoint(
      date: json['date'] as String?,
      score: (json['score'] as num?)?.toDouble(),
    );
  }
}

class InterviewAnalytics {
  const InterviewAnalytics({
    required this.totalSessions,
    required this.completedSessions,
    required this.averageScore,
    required this.bestScore,
    required this.worstScore,
    required this.recentTrend,
  });

  final int totalSessions;
  final int completedSessions;
  final double averageScore;
  final double bestScore;
  final double worstScore;
  final List<InterviewAnalyticsPoint> recentTrend;

  factory InterviewAnalytics.empty() {
    return const InterviewAnalytics(
      totalSessions: 0,
      completedSessions: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      recentTrend: <InterviewAnalyticsPoint>[],
    );
  }

  factory InterviewAnalytics.fromJson(Map<String, dynamic> json) {
    final trend = (json['recentTrend'] as List<dynamic>? ?? <dynamic>[])
        .whereType<Map<String, dynamic>>()
        .map(InterviewAnalyticsPoint.fromJson)
        .toList();

    return InterviewAnalytics(
      totalSessions: json['totalSessions'] as int? ?? 0,
      completedSessions: json['completedSessions'] as int? ?? 0,
      averageScore: (json['averageScore'] as num?)?.toDouble() ?? 0,
      bestScore: (json['bestScore'] as num?)?.toDouble() ?? 0,
      worstScore: (json['worstScore'] as num?)?.toDouble() ?? 0,
      recentTrend: trend,
    );
  }
}

class InterviewFeedback {
  const InterviewFeedback({
    required this.score,
    required this.strengths,
    required this.improvements,
  });

  final double score;
  final String strengths;
  final String improvements;

  factory InterviewFeedback.fromJson(Map<String, dynamic> json) {
    return InterviewFeedback(
      score: (json['score'] as num?)?.toDouble() ?? 0,
      strengths: json['strengths'] as String? ?? '',
      improvements: json['improvements'] as String? ?? '',
    );
  }
}

class InterviewOverallFeedback {
  const InterviewOverallFeedback({
    required this.overallScore,
    required this.summary,
    required this.topStrengths,
    required this.focusAreas,
  });

  final double overallScore;
  final String summary;
  final List<String> topStrengths;
  final List<String> focusAreas;

  factory InterviewOverallFeedback.fromJson(Map<String, dynamic> json) {
    return InterviewOverallFeedback(
      overallScore: (json['overallScore'] as num?)?.toDouble() ?? 0,
      summary: json['summary'] as String? ?? '',
      topStrengths:
          (json['topStrengths'] as List<dynamic>? ?? <dynamic>[]).whereType<String>().toList(),
      focusAreas:
          (json['focusAreas'] as List<dynamic>? ?? <dynamic>[]).whereType<String>().toList(),
    );
  }
}

class SubmitInterviewAnswerResult {
  const SubmitInterviewAnswerResult({
    required this.answerId,
    required this.questionId,
    required this.feedback,
    required this.sessionCompleted,
    required this.overallFeedback,
  });

  final String answerId;
  final String questionId;
  final InterviewFeedback feedback;
  final bool sessionCompleted;
  final InterviewOverallFeedback? overallFeedback;

  factory SubmitInterviewAnswerResult.fromJson(Map<String, dynamic> json) {
    return SubmitInterviewAnswerResult(
      answerId: json['answerId'] as String? ?? '',
      questionId: json['questionId'] as String? ?? '',
      feedback: InterviewFeedback.fromJson(
        (json['feedback'] as Map<String, dynamic>? ?? <String, dynamic>{}),
      ),
      sessionCompleted: json['sessionCompleted'] as bool? ?? false,
      overallFeedback: json['overallFeedback'] is Map<String, dynamic>
          ? InterviewOverallFeedback.fromJson(json['overallFeedback'] as Map<String, dynamic>)
          : null,
    );
  }
}

class ProfilePreferences {
  const ProfilePreferences({
    required this.targetRole,
    required this.experienceLevel,
    required this.bio,
  });

  final String targetRole;
  final String experienceLevel;
  final String bio;

  factory ProfilePreferences.defaults() {
    return const ProfilePreferences(
      targetRole: 'frontend-engineer',
      experienceLevel: 'entry-level',
      bio: '',
    );
  }

  ProfilePreferences copyWith({
    String? targetRole,
    String? experienceLevel,
    String? bio,
  }) {
    return ProfilePreferences(
      targetRole: targetRole ?? this.targetRole,
      experienceLevel: experienceLevel ?? this.experienceLevel,
      bio: bio ?? this.bio,
    );
  }
}
