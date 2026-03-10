"use client";

import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import {
    BadgeCheck,
    Download,
    FileText,
    Sparkles,
    Target,
    WandSparkles,
} from "lucide-react";

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
import { useAuth } from "@/app/(auth)/auth-context";
import {
    createResume,
    createResumeSection,
    getResumeById,
    getUserResumes,
    updateResumeSection,
    type ResumeSection,
} from "./api";

const sectionChecklist = [
    "Strong summary tailored to target role",
    "Experience bullets with measurable impact",
    "Relevant skills aligned with the job post",
    "Consistent tense and clean formatting",
];

const keywordSuggestions = [
    "Cross-functional collaboration",
    "Performance optimization",
    "Design systems",
    "A/B testing",
    "Stakeholder communication",
    "Product analytics",
];

export default function ResumePage() {
    const { user } = useAuth();

    const [fullName, setFullName] = useState("");
    const [targetRole, setTargetRole] = useState("Frontend Engineer");
    const [targetCompany, setTargetCompany] = useState("");
    const [template, setTemplate] = useState("modern");
    const [summary, setSummary] = useState("");
    const [experience, setExperience] = useState("");

    const [resumeId, setResumeId] = useState<string | null>(null);
    const [setupSectionId, setSetupSectionId] = useState<string | null>(null);
    const [summarySectionId, setSummarySectionId] = useState<string | null>(null);
    const [experienceSectionId, setExperienceSectionId] = useState<string | null>(null);

    const [loadingResume, setLoadingResume] = useState(true);
    const [savingResume, setSavingResume] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const summaryWords = useMemo(() => {
        const value = summary.trim();
        if (!value) return 0;
        return value.split(/\s+/).length;
    }, [summary]);

    const experienceBullets = useMemo(() => {
        return experience
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean).length;
    }, [experience]);

    const getApiErrorMessage = (error: unknown, fallback: string): string => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;
            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }
        return fallback;
    };

    const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
        return typeof value === "object" && value !== null;
    };

    const readTextContent = (value: unknown): string => {
        if (typeof value === "string") {
            return value;
        }

        if (isObjectRecord(value) && typeof value.text === "string") {
            return value.text;
        }

        return "";
    };

    const readSetupContent = (value: unknown): Partial<{
        fullName: string;
        targetRole: string;
        targetCompany: string;
        template: string;
    }> => {
        if (!isObjectRecord(value)) {
            return {};
        }

        const setup = value.kind === "SETUP" && isObjectRecord(value.payload)
            ? value.payload
            : value;

        return {
            fullName: typeof setup.fullName === "string" ? setup.fullName : undefined,
            targetRole: typeof setup.targetRole === "string" ? setup.targetRole : undefined,
            targetCompany: typeof setup.targetCompany === "string" ? setup.targetCompany : undefined,
            template: typeof setup.template === "string" ? setup.template : undefined,
        };
    };

    const buildResumeTitle = (): string => {
        const role = targetRole.trim() || "Resume";
        const company = targetCompany.trim();
        return company ? `${role} - ${company}` : role;
    };

    const upsertSection = async (
        activeResumeId: string,
        existingSectionId: string | null,
        payload: {
            type: "EDUCATION" | "EXPERIENCE" | "SKILLS" | "PROJECT" | "OTHER";
            content: unknown;
            order: number;
        }
    ): Promise<ResumeSection> => {
        if (existingSectionId) {
            return updateResumeSection(existingSectionId, { content: payload.content });
        }

        return createResumeSection(activeResumeId, payload);
    };

    useEffect(() => {
        if (!fullName.trim() && user?.name) {
            setFullName(user.name);
        }
    }, [fullName, user?.name]);

    useEffect(() => {
        const loadResume = async () => {
            setLoadingResume(true);
            setErrorMessage(null);
            setStatusMessage(null);

            try {
                const resumes = await getUserResumes();
                if (!resumes.length) {
                    setStatusMessage("No saved resume yet. Start editing, then click Save Resume.");
                    return;
                }

                const latestResume = resumes[0];
                const detail = await getResumeById(latestResume.id);

                setResumeId(detail.id);

                const sections = detail.resumeSections;
                const setupSection = sections.find((section) => {
                    if (section.type !== "OTHER") return false;
                    if (!isObjectRecord(section.content)) return false;
                    return section.content.kind === "SETUP";
                });
                const summarySection = sections.find((section) => {
                    if (section.type !== "OTHER") return false;
                    if (!isObjectRecord(section.content)) return false;
                    return section.content.kind === "SUMMARY";
                });
                const experienceSection = sections.find((section) => section.type === "EXPERIENCE");

                if (setupSection) {
                    const setup = readSetupContent(setupSection.content);
                    if (setup.fullName) setFullName(setup.fullName);
                    if (setup.targetRole) setTargetRole(setup.targetRole);
                    if (typeof setup.targetCompany === "string") setTargetCompany(setup.targetCompany);
                    if (setup.template) setTemplate(setup.template);
                    setSetupSectionId(setupSection.id);
                }

                if (summarySection) {
                    setSummary(readTextContent(summarySection.content));
                    setSummarySectionId(summarySection.id);
                }

                if (experienceSection) {
                    setExperience(readTextContent(experienceSection.content));
                    setExperienceSectionId(experienceSection.id);
                }

                setStatusMessage("Loaded your latest saved resume.");
            } catch (error) {
                setErrorMessage(getApiErrorMessage(error, "Could not load resume data."));
            } finally {
                setLoadingResume(false);
            }
        };

        void loadResume();
    }, []);

    const handleSaveResume = async () => {
        setSavingResume(true);
        setErrorMessage(null);
        setStatusMessage(null);

        try {
            let activeResumeId = resumeId;

            if (!activeResumeId) {
                const created = await createResume({ title: buildResumeTitle() });
                activeResumeId = created.id;
                setResumeId(created.id);
            }

            const [nextSetupSection, nextSummarySection, nextExperienceSection] = await Promise.all([
                upsertSection(activeResumeId, setupSectionId, {
                    type: "OTHER",
                    order: 1,
                    content: {
                        kind: "SETUP",
                        payload: {
                            fullName: fullName.trim(),
                            targetRole: targetRole.trim(),
                            targetCompany: targetCompany.trim(),
                            template,
                        },
                    },
                }),
                upsertSection(activeResumeId, summarySectionId, {
                    type: "OTHER",
                    order: 2,
                    content: {
                        kind: "SUMMARY",
                        text: summary.trim(),
                    },
                }),
                upsertSection(activeResumeId, experienceSectionId, {
                    type: "EXPERIENCE",
                    order: 3,
                    content: {
                        text: experience.trim(),
                    },
                }),
            ]);

            setSetupSectionId(nextSetupSection.id);
            setSummarySectionId(nextSummarySection.id);
            setExperienceSectionId(nextExperienceSection.id);
            setStatusMessage("Resume saved successfully.");
        } catch (error) {
            setErrorMessage(getApiErrorMessage(error, "Could not save resume. Please try again."));
        } finally {
            setSavingResume(false);
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <section className="rounded-2xl border bg-gradient-to-r from-emerald-50 to-sky-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                            <Sparkles className="h-3.5 w-3.5" />
                            Resume Builder
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Build a resume that gets interviews
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                            Tailor each section to your target role, optimize for ATS keywords, and export a
                            clean one-page resume.
                        </p>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none">
                            <WandSparkles className="h-4 w-4" />
                            Improve Content
                        </Button>
                        <Button className="flex-1 md:flex-none" onClick={handleSaveResume} disabled={savingResume || loadingResume}>
                            {savingResume ? "Saving..." : "Save Resume"}
                        </Button>
                        <Button className="flex-1 md:flex-none" disabled>
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
                {statusMessage ? <p className="mt-3 text-sm text-emerald-700">{statusMessage}</p> : null}
                {errorMessage ? <p className="mt-3 text-sm text-destructive">{errorMessage}</p> : null}
            </section>

            <section className="grid gap-4 lg:grid-cols-[380px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resume Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full name</label>
                            <Input
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target role</label>
                            <Input
                                value={targetRole}
                                onChange={(event) => setTargetRole(event.target.value)}
                                placeholder="Role you are applying for"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target company (optional)</label>
                            <Input
                                value={targetCompany}
                                onChange={(event) => setTargetCompany(event.target.value)}
                                placeholder="Company name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Template</label>
                            <Select value={template} onValueChange={setTemplate}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="modern">Modern</SelectItem>
                                    <SelectItem value="minimal">Minimal</SelectItem>
                                    <SelectItem value="classic">Classic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Quality checklist</p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {sectionChecklist.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="text-base">Professional Summary</CardTitle>
                                <span className="text-xs text-muted-foreground">Target: 60-90 words</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                value={summary}
                                onChange={(event) => setSummary(event.target.value)}
                                placeholder="Write a concise summary focused on your impact, strengths, and target role."
                                className="min-h-28"
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{summaryWords} words</span>
                                <Button variant="outline" size="sm">Generate Summary Draft</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="text-base">Experience Highlights</CardTitle>
                                <span className="text-xs text-muted-foreground">Use one line per bullet</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                value={experience}
                                onChange={(event) => setExperience(event.target.value)}
                                placeholder="- Improved page load speed by 35% by optimizing image delivery and caching."
                                className="min-h-36"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <span>{experienceBullets} bullets drafted</span>
                                <Button onClick={handleSaveResume} disabled={savingResume || loadingResume}>
                                    {savingResume ? "Saving..." : "Save Section"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">ATS Match</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span>Keyword coverage</span>
                            <span className="font-semibold text-amber-600">76%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span>Section completeness</span>
                            <span className="font-semibold text-emerald-600">88%</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span>Formatting quality</span>
                            <span className="font-semibold text-sky-600">81%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Suggested Keywords</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {keywordSuggestions.map((keyword) => (
                            <span
                                key={keyword}
                                className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                            >
                                {keyword}
                            </span>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Current Focus</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                            <FileText className="h-3.5 w-3.5" />
                            {template.charAt(0).toUpperCase() + template.slice(1)} Template
                        </p>
                        <p className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                            <Target className="h-3.5 w-3.5" />
                            {targetRole || "No role selected"}
                        </p>
                        <p>
                            Next step: refine your experience bullets with action verbs and at least one metric
                            per bullet.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
