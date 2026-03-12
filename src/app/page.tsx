import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
    { label: "Interview prep tracks", value: "12+" },
    { label: "Resume improvement checks", value: "30+" },
    { label: "Avg weekly practice", value: "4.2 sessions" },
    { label: "Ready-to-apply resumes", value: "1,200+" },
];

const features = [
    {
        title: "Resume Builder",
        description:
            "Craft tailored resumes with actionable feedback to match each job description.",
    },
    {
        title: "Interview Practice",
        description:
            "Run through role-specific mock questions and build confident response habits.",
    },
    {
        title: "Career Dashboard",
        description:
            "Track milestones, plan weekly prep goals, and stay focused on your next move.",
    },
];

const outcomes = [
    "Generate role-specific mock interview sessions in seconds",
    "Keep all prep work in one timeline and track consistency",
    "Turn rough bullets into measurable resume achievements",
];

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 dark:bg-background dark:text-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.25),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.2),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_42%,#111827_100%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.16),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.14),transparent_34%)]" />
            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-6 md:px-8 md:py-8">
                <header className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Sparkles className="h-4 w-4 text-sky-300" />
                        Career Prep App
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="ghost" className="h-8 border-white/15 bg-transparent">
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild size="sm" className="h-8 bg-sky-400 text-slate-950 hover:bg-sky-300">
                            <Link href="/register">Get Started</Link>
                        </Button>
                    </div>
                </header>

                <section className="grid items-start gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="space-y-6">
                        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                            Your structured path from job search to job offer.
                        </h1>
                        <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                            Prepare smarter with guided resume work, targeted interview training, and a
                            dashboard that keeps your momentum visible every week.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg" className="bg-sky-400 text-slate-950 hover:bg-sky-300">
                                <Link href="/register">
                                    Create Free Account
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="ghost"
                                className="border-white/20 bg-transparent"
                            >
                                <Link href="/login">Login</Link>
                            </Button>
                        </div>
                        <ul className="grid gap-2 text-sm text-slate-300">
                            {outcomes.map((item) => (
                                <li key={item} className="flex items-center gap-2 rounded-md border border-white/10 bg-slate-900/45 px-3 py-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Card className="border-white/15 bg-white/5 shadow-2xl shadow-cyan-500/10 backdrop-blur">
                        <CardContent className="space-y-4 p-5">
                            <p className="text-sm font-medium text-sky-200">Prep progress snapshot</p>
                            <div className="space-y-3">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex items-end justify-between border-b border-white/10 pb-2.5">
                                        <span className="text-sm text-slate-300">{stat.label}</span>
                                        <span className="text-lg font-semibold text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-lg border border-sky-300/25 bg-sky-400/10 px-3 py-2.5 text-xs text-sky-100">
                                Tip: keep a 5-day streak by completing one interview prompt per weekday.
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-white/10 bg-slate-900/65 transition hover:-translate-y-0.5 hover:border-sky-300/40">
                            <CardContent className="space-y-3 p-5">
                                <h2 className="text-lg font-semibold text-white">{feature.title}</h2>
                                <p className="text-sm leading-relaxed text-slate-300">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-sky-950/60 to-emerald-950/40 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-300">Start in 2 minutes</p>
                            <h2 className="mt-1 text-xl font-semibold text-white">Create your account and run your first prep session today.</h2>
                        </div>
                        <Button asChild className="bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                            <Link href="/register">Start Free</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
