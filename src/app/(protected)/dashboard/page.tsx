"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, CalendarCheck2, FileText, Flame, Target, TrendingUp, Trophy } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const weeklyTasks = [
    { label: "Finish one behavioral interview session", done: true },
    { label: "Update resume bullets with measurable impact", done: true },
    { label: "Apply to 3 target roles", done: false },
    { label: "Review portfolio/project highlights", done: false },
];

const progress = [
    { label: "Interview readiness", value: "74%", width: "74%", tone: "text-sky-600", bar: "bg-sky-500" },
    { label: "Resume strength", value: "81%", width: "81%", tone: "text-emerald-600", bar: "bg-emerald-500" },
    { label: "Application momentum", value: "62%", width: "62%", tone: "text-amber-500", bar: "bg-amber-500" },
];

const recentActivity = [
    {
        label: "Technical Interview",
        sub: "Score: 87 - 42 min ago",
        accent: "border-l-sky-400 bg-sky-50/60 dark:border-l-sky-500 dark:bg-sky-950/35",
    },
    {
        label: "Resume Updated",
        sub: "Summary section - 2 days ago",
        accent: "border-l-emerald-400 bg-emerald-50/60 dark:border-l-emerald-500 dark:bg-emerald-950/35",
    },
    {
        label: "Behavioral Interview",
        sub: "Score: 79 - 4 days ago",
        accent: "border-l-violet-400 bg-violet-50/60 dark:border-l-violet-500 dark:bg-violet-950/35",
    },
    {
        label: "Job Application",
        sub: "Stripe - Applied 5 days ago",
        accent: "border-l-amber-400 bg-amber-50/60 dark:border-l-amber-500 dark:bg-amber-950/35",
    },
];

export default function DashBoardPage() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-4 md:px-6 md:py-5">
            {/* Hero */}
            <section className="rounded-2xl border bg-muted/40 p-4 md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                            Career Command Center
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Welcome back. Keep your prep streak going.
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                            Track your interview, resume, and application progress in one place.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1 text-sm text-amber-600 dark:border-white/20 dark:bg-white/10 dark:text-amber-300">
                                <Flame className="h-3.5 w-3.5" /> 7-day streak
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1 text-sm text-sky-600 dark:border-white/20 dark:bg-white/10 dark:text-sky-300">
                                <TrendingUp className="h-3.5 w-3.5" /> +12% score improvement
                            </span>
                        </div>
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

            {/* Stat cards */}
            <section className="grid gap-3 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-sky-600" />
                            Interviews This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-3xl font-semibold">3</p>
                            <p className="text-xs text-muted-foreground">1 completed - 2 in progress</p>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-sky-100">
                            <div className="h-full w-1/3 rounded-full bg-sky-500" />
                        </div>
                        <div className="grid grid-cols-3 divide-x text-center text-xs">
                            <div className="pr-2">
                                <p className="font-semibold">1</p>
                                <p className="text-muted-foreground">Done</p>
                            </div>
                            <div className="px-2">
                                <p className="font-semibold">2</p>
                                <p className="text-muted-foreground">Active</p>
                            </div>
                            <div className="pl-2">
                                <p className="font-semibold text-sky-600">87</p>
                                <p className="text-muted-foreground">Best score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-emerald-600" />
                            Resume Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-3xl font-semibold">81%</p>
                            <p className="text-xs text-muted-foreground">Up 5% from last week</p>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-emerald-100">
                            <div className="h-full w-[81%] rounded-full bg-emerald-500" />
                        </div>
                        <div className="grid grid-cols-3 divide-x text-center text-xs">
                            <div className="pr-2">
                                <p className="font-semibold text-emerald-600">88%</p>
                                <p className="text-muted-foreground">Sections</p>
                            </div>
                            <div className="px-2">
                                <p className="font-semibold">76%</p>
                                <p className="text-muted-foreground">Keywords</p>
                            </div>
                            <div className="pl-2">
                                <p className="font-semibold">81%</p>
                                <p className="text-muted-foreground">Format</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Trophy className="h-4 w-4 text-amber-600" />
                            Weekly Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-3xl font-semibold">6/10</p>
                            <p className="text-xs text-muted-foreground">Tasks completed this week</p>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                            <div className="h-full w-[60%] rounded-full bg-amber-500" />
                        </div>
                        <div className="grid grid-cols-3 divide-x text-center text-xs">
                            <div className="pr-2">
                                <p className="font-semibold">6</p>
                                <p className="text-muted-foreground">Done</p>
                            </div>
                            <div className="px-2">
                                <p className="font-semibold">4</p>
                                <p className="text-muted-foreground">Left</p>
                            </div>
                            <div className="pl-2">
                                <p className="font-semibold text-amber-600">60%</p>
                                <p className="text-muted-foreground">Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CalendarCheck2 className="h-4 w-4 text-sky-600" />
                            This Week&apos;s Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {weeklyTasks.map((task) => (
                                <li
                                    key={task.label}
                                    className={cn(
                                        "flex items-start gap-3 rounded-md border p-3",
                                        task.done && "bg-muted/40"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                                            task.done
                                                ? "bg-emerald-500 text-white"
                                                : "border-2 border-muted-foreground/30"
                                        )}
                                    >
                                        {task.done ? "\u2713" : ""}
                                    </span>
                                    <span className={cn(task.done && "text-muted-foreground line-through")}>
                                        {task.label}
                                    </span>
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
                    <CardContent className="space-y-4">
                        {progress.map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{item.label}</span>
                                    <span className={cn("font-semibold", item.tone)}>{item.value}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={cn("h-full rounded-full", item.bar)}
                                        style={{ width: item.width }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="grid gap-2 pt-1 md:grid-cols-2">
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

            {/* Recent Activity */}
            <section>
                <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Activity</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {recentActivity.map((item) => (
                        <div
                            key={item.label}
                            className={cn("rounded-xl border border-l-4 p-4 shadow-sm dark:border-white/10", item.accent)}
                        >
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            <p className="mt-1 text-xs text-muted-foreground dark:text-slate-300">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

