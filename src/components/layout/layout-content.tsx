"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/interview": "Interview Practice",
    "/resume": "Resume Builder",
    "/profile": "Profile",
};

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const title = pageTitles[pathname] ?? "Career Prep";

    return (
        <SidebarInset className="min-h-svh">
            <header className="sticky top-0 z-20 flex h-12 items-center gap-3 border-b bg-background/90 px-3 backdrop-blur md:px-4">
                <SidebarTrigger className="h-8 w-8 shrink-0" />
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm font-medium text-foreground">{title}</span>
            </header>
            <div className="flex-1 pb-5">{children}</div>
        </SidebarInset>
    );
}
