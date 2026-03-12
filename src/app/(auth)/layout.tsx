import { ReactNode } from "react";

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 dark:bg-background dark:text-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(56,189,248,0.26),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_34%),linear-gradient(180deg,#020617_0%,#0f172a_45%,#111827_100%)] dark:bg-[radial-gradient(circle_at_15%_0%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.14),transparent_34%)]" />
            <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 md:px-8">
                <div className="w-full max-w-xl">
                    <div className="rounded-2xl border border-white/15 bg-white/95 p-2 text-slate-900 shadow-2xl shadow-black/20 backdrop-blur md:p-3 dark:border-border dark:bg-card/95 dark:text-card-foreground">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
