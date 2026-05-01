"use client";
import {
    SidebarProvider,
} from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar";
import LayoutContent from "@/components/layout/layout-content";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <LayoutContent>
                {children}
            </LayoutContent>

        </SidebarProvider>
    )
}