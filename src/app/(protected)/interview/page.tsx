"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Clock3, Sparkles, Target } from "lucide-react";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    createInterviewSession,
    getInterviewAnalytics,
    type InterviewAnswerFeedbackResponse,
    type InterviewAnalytics,
    type InterviewQuestion,
    type InterviewType,
    submitInterviewAnswer,
} from "./api";

const prepChecklist = [
    "Research company mission and latest news",
    "Prepare 3 STAR stories",
    "Practice role-specific technical prompts",
    "Review your resume highlights",
];

const coachingTips = [
    "Start with a direct answer in the first sentence.",
    "Use metrics to quantify outcomes where possible.",
    "Close with what you learned and how it applies here.",
];

const interviewTypeLabel: Record<InterviewType, string> = {
    TECHNICAL: "Technical",
    BEHAVIORAL: "Behavioral",
    MIXED: "Mixed",
};

const emptyAnalytics: InterviewAnalytics = {
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0,
    bestScore: 0,
    worstScore: 0,
    recentTrend: [],
};

const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof AxiosError) {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === "string" && responseMessage.trim()) {
            return responseMessage;
        }
    }
    return fallback;
};

export default function InterviewPage() {
    const [targetRole, setTargetRole] = useState("Frontend Engineer");
    const [company, setCompany] = useState("");
    const [interviewType, setInterviewType] = useState<InterviewType>("TECHNICAL");

    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submittedQuestionIds, setSubmittedQuestionIds] = useState<Set<string>>(new Set());

    const [answer, setAnswer] = useState("");
    const [lastFeedback, setLastFeedback] = useState<
        (InterviewAnswerFeedbackResponse & { question: string; answer: string }) | null
    >(null);
    const [sessionOverallFeedback, setSessionOverallFeedback] = useState<InterviewAnswerFeedbackResponse["overallFeedback"]>(null);
    const [analytics, setAnalytics] = useState<InterviewAnalytics>(emptyAnalytics);

    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [creatingSession, setCreatingSession] = useState(false);
    const [submittingAnswer, setSubmittingAnswer] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const sessionStarted = questions.length > 0;
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = sessionStarted && currentQuestionIndex === questions.length - 1;

    const wordCount = useMemo(() => {
        const trimmed = answer.trim();
        if (!trimmed) return 0;
        return trimmed.split(/\s+/).length;
    }, [answer]);

    const completionRate = useMemo(() => {
        if (!questions.length) return 0;
        return Math.round((submittedQuestionIds.size / questions.length) * 100);
    }, [questions.length, submittedQuestionIds]);

    const loadAnalytics = async () => {
        try {
            const response = await getInterviewAnalytics();
            setAnalytics(response);
        } catch (error) {
            setError(getApiErrorMessage(error, "Could not load interview analytics."));
        } finally {
            setLoadingAnalytics(false);
        }
    };

    useEffect(() => {
        void loadAnalytics();
    }, []);

    const handleStartSession = async () => {
        setCreatingSession(true);
        setError(null);
        setSuccess(null);
        setLastFeedback(null);
        setSessionOverallFeedback(null);

        try {
            const response = await createInterviewSession({
                role: targetRole.trim(),
                interviewType,
            });

            if (!response.session.questions.length) {
                throw new Error("No questions were generated for this session.");
            }

            setQuestions(response.session.questions);
            setCurrentQuestionIndex(0);
            setSubmittedQuestionIds(new Set());
            setAnswer("");
            setSuccess(`Session ready: ${response.session.questions.length} questions generated.`);
        } catch (error) {
            setError(getApiErrorMessage(error, "Could not start a new interview session. Please try again."));
        } finally {
            setCreatingSession(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!currentQuestion || !answer.trim()) {
            return;
        }

        setSubmittingAnswer(true);
        setError(null);
        setSuccess(null);

        try {
            const submittedAnswer = answer.trim();
            const feedbackResponse = await submitInterviewAnswer(currentQuestion.id, submittedAnswer);
            setLastFeedback({
                ...feedbackResponse,
                question: currentQuestion.question,
                answer: submittedAnswer,
            });

            setSubmittedQuestionIds((previous) => {
                const next = new Set(previous);
                next.add(currentQuestion.id);
                return next;
            });

            if (isLastQuestion) {
                setSuccess(`Interview session complete. Last score: ${feedbackResponse.feedback.score.toFixed(1)}.`);
                setSessionOverallFeedback(feedbackResponse.overallFeedback);
                setQuestions([]);
                setCurrentQuestionIndex(0);
                setAnswer("");
                setLoadingAnalytics(true);
                await loadAnalytics();
                return;
            }

            setCurrentQuestionIndex((index) => index + 1);
            setAnswer("");
            setSuccess(`Score: ${feedbackResponse.feedback.score.toFixed(1)}. Feedback added below.`);
        } catch (error) {
            setError(getApiErrorMessage(error, "Could not submit your answer. Please retry."));
        } finally {
            setSubmittingAnswer(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-4 md:px-6 md:py-5">
            <section className="rounded-2xl border bg-muted/40 p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800 dark:border dark:border-sky-800/60 dark:bg-sky-900/40 dark:text-sky-200">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI Interview Coach
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Interview Practice Studio
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                            Simulate realistic interviews, capture response quality, and improve with targeted
                            feedback loops.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-3 lg:grid-cols-[340px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Session Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target role</label>
                            <Input
                                value={targetRole}
                                onChange={(event) => setTargetRole(event.target.value)}
                                placeholder="Enter role"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company (optional)</label>
                            <Input
                                value={company}
                                onChange={(event) => setCompany(event.target.value)}
                                placeholder="Enter company (optional)"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interview type</label>
                            <Select
                                value={interviewType}
                                onValueChange={(value) => setInterviewType(value as InterviewType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select interview type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TECHNICAL">Technical</SelectItem>
                                    <SelectItem value="BEHAVIORAL">Behavioral</SelectItem>
                                    <SelectItem value="MIXED">Mixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Quick prep checklist</p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {prepChecklist.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            className="w-full"
                            disabled={!targetRole.trim() || creatingSession}
                            onClick={handleStartSession}
                        >
                            {creatingSession ? "Starting..." : "Start Session"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    {!sessionStarted ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Interview Session</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 text-sm">
                                {success ? (
                                    <p className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-700">{success}</p>
                                ) : null}
                                {error ? (
                                    <p className="rounded-md bg-red-50 px-3 py-2 text-red-700">{error}</p>
                                ) : null}
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl border bg-sky-50 p-4 text-center">
                                        <p className="text-2xl font-semibold text-sky-700">5</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Questions per session</p>
                                    </div>
                                    <div className="rounded-xl border bg-emerald-50 p-4 text-center">
                                        <p className="text-2xl font-semibold text-emerald-700">AI</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Powered feedback</p>
                                    </div>
                                    <div className="rounded-xl border bg-violet-50 p-4 text-center">
                                        <p className="text-2xl font-semibold text-violet-700">STAR</p>
                                        <p className="mt-1 text-xs text-muted-foreground">Structured format</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-medium text-foreground">How it works</p>
                                    <ol className="space-y-2 text-muted-foreground">
                                        {[
                                            "Select your target role, company, and interview type on the left.",
                                            "Click Start Session — AI generates a set of tailored questions.",
                                            "Answer each question using the STAR method (Situation, Task, Action, Result).",
                                            "Submit to receive a score and automatically move to the next question.",
                                            "Review your performance in the analytics snapshot below.",
                                        ].map((step, i) => (
                                            <li key={step} className="flex items-start gap-3 rounded-md border p-3">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                                                    {i + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Sample question</p>
                                    <p className="text-foreground">Tell me about a time you had to deliver a project under a tight deadline. What was your approach and what was the outcome?</p>
                                </div>
                                {sessionOverallFeedback ? (
                                    <div className="space-y-3 rounded-xl border bg-emerald-50/70 p-4">
                                        <p className="text-sm font-semibold text-emerald-800">Session Wrap-Up Feedback</p>
                                        <p className="text-sm text-emerald-700">
                                            Overall score: {sessionOverallFeedback.overallScore.toFixed(1)}
                                        </p>
                                        <p className="text-sm text-slate-700">{sessionOverallFeedback.summary}</p>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Top strengths</p>
                                            <ul className="space-y-1 text-sm text-slate-700">
                                                {sessionOverallFeedback.topStrengths.length ? sessionOverallFeedback.topStrengths.map((item) => (
                                                    <li key={item} className="flex items-start gap-2">
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                                        {item}
                                                    </li>
                                                )) : (
                                                    <li>No strengths captured yet.</li>
                                                )}
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Focus areas</p>
                                            <ul className="space-y-1 text-sm text-slate-700">
                                                {sessionOverallFeedback.focusAreas.length ? sessionOverallFeedback.focusAreas.map((item) => (
                                                    <li key={item} className="flex items-start gap-2">
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-600" />
                                                        {item}
                                                    </li>
                                                )) : (
                                                    <li>No improvement areas captured yet.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <CardTitle className="text-base">
                                            Question {currentQuestionIndex + 1} of {questions.length}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                                                <Briefcase className="h-3 w-3" />
                                                {interviewTypeLabel[interviewType]}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
                                                <Clock3 className="h-3 w-3" />
                                                2:00 suggested
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-lg leading-relaxed">{currentQuestion?.question}</p>
                                    <p className="text-xs text-muted-foreground">Progress: {submittedQuestionIds.size}/{questions.length} ({completionRate}%)</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Response Workspace</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Textarea
                                        value={answer}
                                        onChange={(event) => setAnswer(event.target.value)}
                                        placeholder="Draft your answer here using STAR: Situation, Task, Action, Result."
                                        className="min-h-36"
                                    />
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>Word count: {wordCount}</span>
                                            <span>Target: 130-180 words</span>
                                        </div>
                                        <Button
                                            disabled={!answer.trim() || submittingAnswer}
                                            onClick={handleSubmitAnswer}
                                        >
                                            {submittingAnswer
                                                ? "Submitting..."
                                                : isLastQuestion
                                                    ? "Submit & Finish"
                                                    : "Submit & Next"}
                                        </Button>
                                    </div>
                                    {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
                                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                                </CardContent>
                            </Card>
                            {lastFeedback ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Latest AI Feedback</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <p className="rounded-md border bg-muted/30 px-3 py-2">
                                            <span className="font-medium">Question:</span> {lastFeedback.question}
                                        </p>
                                        <div className="rounded-md border bg-sky-50 px-3 py-2">
                                            <p className="font-medium text-sky-800">Your answer</p>
                                            <p className="mt-1 whitespace-pre-wrap text-slate-700">{lastFeedback.answer}</p>
                                        </div>
                                        <p className="rounded-md border bg-emerald-50 px-3 py-2 text-emerald-700">
                                            <span className="font-medium">Score:</span> {lastFeedback.feedback.score.toFixed(1)}
                                        </p>
                                        <div className="rounded-md border px-3 py-2">
                                            <p className="font-medium">Strengths</p>
                                            <p className="mt-1 text-muted-foreground">{lastFeedback.feedback.strengths || "No strengths provided."}</p>
                                        </div>
                                        <div className="rounded-md border px-3 py-2">
                                            <p className="font-medium">Improvements</p>
                                            <p className="mt-1 text-muted-foreground">{lastFeedback.feedback.improvements || "No improvements provided."}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : null}
                        </>
                    )}
                </div>
            </section>

            <section className="grid gap-3 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Coaching Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {coachingTips.map((tip) => (
                                <li key={tip} className="flex items-start gap-2">
                                    <Target className="mt-0.5 h-4 w-4 text-sky-600" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Performance Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl border bg-emerald-50 py-3">
                                <p className="text-xl font-semibold text-emerald-700">
                                    {loadingAnalytics ? "\u2013" : analytics.completedSessions}
                                </p>
                                <p className="text-xs text-muted-foreground">Sessions</p>
                            </div>
                            <div className="rounded-xl border bg-sky-50 py-3">
                                <p className="text-xl font-semibold text-sky-700">
                                    {loadingAnalytics ? "\u2013" : analytics.bestScore.toFixed(0)}
                                </p>
                                <p className="text-xs text-muted-foreground">Best score</p>
                            </div>
                            <div className="rounded-xl border bg-amber-50 py-3">
                                <p className="text-xl font-semibold text-amber-700">
                                    {loadingAnalytics ? "\u2013" : analytics.averageScore.toFixed(1)}
                                </p>
                                <p className="text-xs text-muted-foreground">Avg score</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Average score</span>
                                    <span className="font-medium">
                                        {loadingAnalytics ? "\u2013" : `${analytics.averageScore.toFixed(0)}%`}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-amber-500 transition-all"
                                        style={{ width: loadingAnalytics ? "0%" : `${Math.min(analytics.averageScore, 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Best score</span>
                                    <span className="font-medium">
                                        {loadingAnalytics ? "\u2013" : `${analytics.bestScore.toFixed(0)}%`}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-sky-500 transition-all"
                                        style={{ width: loadingAnalytics ? "0%" : `${Math.min(analytics.bestScore, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-muted-foreground">Total sessions</span>
                            <span className="font-semibold">
                                {loadingAnalytics ? "..." : analytics.totalSessions}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Current Focus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                            <Briefcase className="h-3.5 w-3.5" />
                            {interviewTypeLabel[interviewType]} Session
                        </p>
                        <p className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                            <Target className="h-3.5 w-3.5" />
                            {targetRole || "No role selected"}
                        </p>
                        <p>
                            {company
                                ? `Tailor examples for ${company}.`
                                : "Tailor every answer to measurable impact and clear ownership."}
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
