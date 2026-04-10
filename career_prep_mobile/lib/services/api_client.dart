import 'package:dio/dio.dart';

import '../models/app_models.dart';
import 'cookie_jar_factory.dart';
import 'dio_cookie_setup.dart';

class ApiClient {
  ApiClient._(this._dio);

  // Replace with your API subdomain once setup-https.sh has run.
  // e.g. 'https://api.yourdomain.com/api'
  static const String defaultBaseUrl = 'https://api.yourdomain.com/api';

  final Dio _dio;

  static Future<ApiClient> create({String? baseUrl}) async {
    final cookieJar = await createCookieJar();

    final dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? defaultBaseUrl,
        contentType: Headers.jsonContentType,
        responseType: ResponseType.json,
        extra: <String, dynamic>{'withCredentials': true},
        validateStatus: (status) => status != null && status < 500,
      ),
    );

    attachCookieHandling(dio, cookieJar);
    dio.interceptors.add(
      InterceptorsWrapper(
        onResponse: (response, handler) {
          if (response.statusCode != null && response.statusCode! >= 400) {
            handler.reject(
              DioException.badResponse(
                statusCode: response.statusCode!,
                requestOptions: response.requestOptions,
                response: response,
              ),
            );
            return;
          }
          handler.next(response);
        },
      ),
    );

    return ApiClient._(dio);
  }

  String _readMessage(DioException exception, String fallback) {
    final data = exception.response?.data;
    if (data is Map<String, dynamic>) {
      final message = data['message'];
      if (message is String && message.trim().isNotEmpty) {
        return message;
      }
    }
    return fallback;
  }

  Never _throwFriendly(DioException exception, String fallback) {
    throw Exception(_readMessage(exception, fallback));
  }

  Future<AppUser> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );
      return AppUser.fromJson(response.data?['user'] as Map<String, dynamic>? ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Registration failed.');
    }
  }

  Future<AppUser> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return AppUser.fromJson(response.data?['user'] as Map<String, dynamic>? ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Login failed.');
    }
  }

  Future<AppUser> getCurrentUser() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/auth/me');
      return AppUser.fromJson(response.data?['user'] as Map<String, dynamic>? ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not load the current user.');
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post<Map<String, dynamic>>('/auth/logout');
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not log out.');
    }
  }

  Future<AppUser> updateCurrentUser({
    required String name,
    required String email,
  }) async {
    try {
      final response = await _dio.put<Map<String, dynamic>>(
        '/auth/me',
        data: {'name': name, 'email': email},
      );
      return AppUser.fromJson(response.data?['user'] as Map<String, dynamic>? ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not update your profile.');
    }
  }

  Future<List<ResumeSummaryItem>> getUserResumes() async {
    try {
      final response = await _dio.get<List<dynamic>>('/resumes');
      return (response.data ?? <dynamic>[])
          .whereType<Map<String, dynamic>>()
          .map(ResumeSummaryItem.fromJson)
          .toList();
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not load resumes.');
    }
  }

  Future<ResumeDetail> getResumeById(String resumeId) async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/resumes/$resumeId');
      return ResumeDetail.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not load the selected resume.');
    }
  }

  Future<ResumeDetail> createResume(String title) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/resumes',
        data: {'title': title},
      );
      return ResumeDetail.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not create a resume.');
    }
  }

  Future<ResumeSection> createResumeSection({
    required String resumeId,
    required String type,
    required int order,
    required dynamic content,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/resumes/$resumeId/sections',
        data: {'type': type, 'order': order, 'content': content},
      );
      return ResumeSection.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not save a resume section.');
    }
  }

  Future<ResumeSection> updateResumeSection({
    required String sectionId,
    required dynamic content,
  }) async {
    try {
      final response = await _dio.patch<Map<String, dynamic>>(
        '/resumes/sections/$sectionId',
        data: {'content': content},
      );
      return ResumeSection.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not update the resume section.');
    }
  }

  Future<InterviewSession> createInterviewSession({
    required String role,
    required String interviewType,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/interviews',
        data: {'role': role, 'interviewType': interviewType},
      );
      final session = response.data?['session'] as Map<String, dynamic>? ?? <String, dynamic>{};
      return InterviewSession.fromJson(session);
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not start an interview session.');
    }
  }

  Future<SubmitInterviewAnswerResult> submitInterviewAnswer({
    required String questionId,
    required String answer,
  }) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/interviews/questions/$questionId/answer',
        data: {'answer': answer},
      );
      return SubmitInterviewAnswerResult.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not submit your interview answer.');
    }
  }

  Future<InterviewAnalytics> getInterviewAnalytics() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/interviews/analytics');
      return InterviewAnalytics.fromJson(response.data ?? <String, dynamic>{});
    } on DioException catch (exception) {
      _throwFriendly(exception, 'Could not load interview analytics.');
    }
  }
}
