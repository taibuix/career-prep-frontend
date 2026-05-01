import api from "@/lib/axios";

export type ResumeSectionType = "EDUCATION" | "EXPERIENCE" | "SKILLS" | "PROJECT" | "OTHER";

export interface ResumeSummaryItem {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeSection {
    id: string;
    resumeId: string;
    order: number;
    type: ResumeSectionType;
    content: unknown;
    createdAt: string;
    updatedAt: string;
}

export interface ResumeDetail {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    resumeSections: ResumeSection[];
}

interface CreateResumePayload {
    title: string;
}

interface CreateSectionPayload {
    type: ResumeSectionType;
    content: unknown;
    order: number;
}

interface UpdateSectionPayload {
    content: unknown;
}

export const getUserResumes = async (): Promise<ResumeSummaryItem[]> => {
    const response = await api.get("/resumes");
    return response.data;
};

export const getResumeById = async (resumeId: string): Promise<ResumeDetail> => {
    const response = await api.get(`/resumes/${resumeId}`);
    return response.data;
};

export const createResume = async (payload: CreateResumePayload): Promise<ResumeDetail> => {
    const response = await api.post("/resumes", payload);
    return response.data;
};

export const createResumeSection = async (
    resumeId: string,
    payload: CreateSectionPayload
): Promise<ResumeSection> => {
    const response = await api.post(`/resumes/${resumeId}/sections`, payload);
    return response.data;
};

export const updateResumeSection = async (
    sectionId: string,
    payload: UpdateSectionPayload
): Promise<ResumeSection> => {
    const response = await api.patch(`/resumes/sections/${sectionId}`, payload);
    return response.data;
};

export interface ResumeFeedback {
    id: string;
    resumeId: string;
    score: number;
    summary: string;
    suggestions: string[];
    sectionTips: Record<string, string>;
    updatedAt: string;
}

export const analyzeResume = async (resumeId: string): Promise<ResumeFeedback> => {
    const response = await api.post(`/resumes/${resumeId}/analyze`);
    return response.data.feedback;
};
