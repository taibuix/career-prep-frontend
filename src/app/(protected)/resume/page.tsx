"use client";

import { useMemo, useState } from "react";
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
    const [fullName, setFullName] = useState("Tai Nguyen");
    const [targetRole, setTargetRole] = useState("Frontend Engineer");
    const [targetCompany, setTargetCompany] = useState("");
    const [template, setTemplate] = useState("modern");
    const [summary, setSummary] = useState("");
    const [experience, setExperience] = useState("");

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
                        <Button className="flex-1 md:flex-none">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
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
                                <Button disabled={!experience.trim()}>Save Section</Button>
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
