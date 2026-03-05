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

export const createInterviewSession = async (
    payload: CreateInterviewSessionPayload
): Promise<CreateInterviewSessionResponse> => {
    const response = await api.post("/interviews", payload);
    return response.data;
};

export const submitInterviewAnswer = async (
    questionId: string,
    answer: string
): Promise<void> => {
    await api.post(`/interviews/questions/${questionId}/answer`, { answer });
};

export const getInterviewAnalytics = async (): Promise<InterviewAnalytics> => {
    const response = await api.get("/interviews/analytics");
    return response.data;
};
