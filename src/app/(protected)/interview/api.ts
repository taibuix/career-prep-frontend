import api from "@/lib/axios";

export type InterviewType = "TECHNICAL" | "BEHAVIORAL" | "MIXED";

export interface InterviewQuestion {
    id: string;
    sessionId: string;
    question: string;
}

export interface InterviewSession {
    id: string;
    role: string;
    interviewType: InterviewType;
    status: "IN_PROGRESS" | "COMPLETED";
    questions: InterviewQuestion[];
}

export interface InterviewAnalytics {
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    recentTrend: Array<{
        date: string | null;
        score: number | null;
    }>;
}

interface CreateInterviewSessionPayload {
    role: string;
    interviewType: InterviewType;
}

interface CreateInterviewSessionResponse {
    session: InterviewSession;
}

export interface InterviewAnswerFeedbackResponse {
    answerId: string;
    questionId: string;
    feedback: {
        score: number;
        strengths: string;
        improvements: string;
    };
    sessionCompleted: boolean;
    overallFeedback: {
        overallScore: number;
        summary: string;
        topStrengths: string[];
        focusAreas: string[];
    } | null;
}

export const createInterviewSession = async (
    payload: CreateInterviewSessionPayload
): Promise<CreateInterviewSessionResponse> => {
    const response = await api.post("/interviews", payload);
    return response.data;
};

export const submitInterviewAnswer = async (
    questionId: string,
    answer: string
): Promise<InterviewAnswerFeedbackResponse> => {
    const response = await api.post(`/interviews/questions/${questionId}/answer`, { answer });
    return response.data;
};

export const getInterviewAnalytics = async (): Promise<InterviewAnalytics> => {
    const response = await api.get("/interviews/analytics");
    return response.data;
};
