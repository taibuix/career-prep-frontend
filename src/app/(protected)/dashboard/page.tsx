"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, CalendarCheck2, FileText, Target, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const weeklyTasks = [
    "Finish one behavioral interview session",
    "Update resume bullets with measurable impact",
    "Apply to 3 target roles",
    "Review portfolio/project highlights",
];

const progress = [
    { label: "Interview readiness", value: "74%", tone: "text-sky-600" },
    { label: "Resume strength", value: "81%", tone: "text-emerald-600" },
    { label: "Application momentum", value: "62%", tone: "text-amber-600" },
];

export default function DashBoardPage() {
    return (
        <div className="space-y-6 p-4 md:p-6">
            <section className="rounded-2xl border bg-gradient-to-r from-sky-50 to-blue-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
                            Career Command Center
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Welcome back. Keep your prep streak going.
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                            Track your interview, resume, and application progress in one place.
                        </p>
                    </div>
                    <Link
                        href="/interview"
                        className={cn(buttonVariants({ size: "lg" }), "w-full md:w-auto")}
                    >
                        Continue Interview Prep
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-sky-600" />
                            Interviews This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">3</p>
                        <p className="text-xs text-muted-foreground">1 completed, 2 in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-emerald-600" />
                            Resume Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">81%</p>
                        <p className="text-xs text-muted-foreground">Up 5% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Trophy className="h-4 w-4 text-amber-600" />
                            Weekly Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">6/10</p>
                        <p className="text-xs text-muted-foreground">Tasks completed</p>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CalendarCheck2 className="h-4 w-4 text-sky-600" />
                            This Week’s Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {weeklyTasks.map((task) => (
                                <li key={task} className="flex items-start gap-2 rounded-md border p-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                                    {task}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Target className="h-4 w-4 text-emerald-600" />
                            Progress Snapshot
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {progress.map((item) => (
                            <div key={item.label} className="flex items-center justify-between rounded-md border p-3 text-sm">
                                <span>{item.label}</span>
                                <span className={cn("font-semibold", item.tone)}>{item.value}</span>
                            </div>
                        ))}
                        <div className="grid gap-2 pt-2 md:grid-cols-2">
                            <Link href="/resume" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                                Open Resume Builder
                            </Link>
                            <Link href="/profile" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                                Update Profile
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
