"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Briefcase, User, LogOut, FileText, Sparkles } from "lucide-react";
import { useAuth } from "@/app/(auth)/auth-context";

const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Interviews", url: "/interview", icon: Briefcase },
    { title: "Resumes", url: "/resume", icon: FileText },
    { title: "Profile", url: "/profile", icon: User },
];

export default function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    return (
        <Sidebar side="left" collapsible="icon" variant="inset">
            <SidebarContent>
                <SidebarHeader className="border-b">
                    <div className="flex items-center gap-2 px-1 py-1">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="group-data-[collapsible=icon]:hidden">
                            <p className="text-sm font-semibold leading-none">Career Prep</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">Interview workspace</p>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarSeparator />
                <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                        <p className="truncate text-sm font-medium leading-none">{user?.name ?? "—"}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
                    </div>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            className="cursor-pointer text-muted-foreground hover:text-destructive"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
