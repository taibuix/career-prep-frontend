"use client";

import { useState } from "react";
import { Briefcase, Mail, Save, User2 } from "lucide-react";

import { useAuth } from "@/app/(auth)/auth-context";
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
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
    const { user } = useAuth();

    const [name, setName] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [targetRole, setTargetRole] = useState("frontend-engineer");
    const [experienceLevel, setExperienceLevel] = useState("entry-level");
    const [bio, setBio] = useState("");
    const [saved, setSaved] = useState(false);

    const onSave = () => {
        setSaved(true);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <section className="rounded-2xl border bg-gradient-to-r from-amber-50 to-rose-50 p-5">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                        Profile Settings
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Personalize your prep profile
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                        Keep your role focus and experience context updated to get better interview and resume
                        suggestions.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full name</label>
                            <div className="relative">
                                <User2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    value={name ?? user?.name ?? ""}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    value={email ?? user?.email ?? ""}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target role</label>
                                <Select value={targetRole} onValueChange={setTargetRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="frontend-engineer">Frontend Engineer</SelectItem>
                                        <SelectItem value="backend-engineer">Backend Engineer</SelectItem>
                                        <SelectItem value="fullstack-engineer">Fullstack Engineer</SelectItem>
                                        <SelectItem value="product-manager">Product Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Experience level</label>
                                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="entry-level">Entry level</SelectItem>
                                        <SelectItem value="mid-level">Mid level</SelectItem>
                                        <SelectItem value="senior-level">Senior level</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Career Bio</label>
                            <Textarea
                                value={bio}
                                onChange={(event) => {
                                    setBio(event.target.value);
                                    if (saved) setSaved(false);
                                }}
                                placeholder="Write 3-5 lines about your strengths, goals, and recent achievements."
                                className="min-h-28"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={onSave}>
                                <Save className="h-4 w-4" />
                                Save Profile
                            </Button>
                            {saved && <p className="text-sm text-emerald-600">Profile changes saved.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p className="rounded-md border p-3">
                            <span className="mb-1 flex items-center gap-2 font-medium text-foreground">
                                <Briefcase className="h-4 w-4 text-amber-600" />
                                Focus
                            </span>
                            {targetRole.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}
                        </p>
                        <p className="rounded-md border p-3">
                            <span className="mb-1 block font-medium text-foreground">Level</span>
                            {experienceLevel.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}
                        </p>
                        <p className="rounded-md border p-3">
                            <span className="mb-1 block font-medium text-foreground">Bio status</span>
                            {bio.trim() ? "Complete" : "Add a short bio to improve recommendations"}
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
