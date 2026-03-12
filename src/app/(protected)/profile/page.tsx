"use client";

import { useMemo, useState } from "react";
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

const PROFILE_PREFS_STORAGE_KEY = "career-prep.profile.preferences";

type ProfilePrefs = {
    targetRole: string;
    experienceLevel: string;
    bio: string;
};

const defaultProfilePrefs: ProfilePrefs = {
    targetRole: "frontend-engineer",
    experienceLevel: "entry-level",
    bio: "",
};

const getStoredProfilePrefs = (): ProfilePrefs => {
    if (typeof window === "undefined") {
        return defaultProfilePrefs;
    }

    try {
        const stored = window.localStorage.getItem(PROFILE_PREFS_STORAGE_KEY);
        if (!stored) {
            return defaultProfilePrefs;
        }

        return { ...defaultProfilePrefs, ...(JSON.parse(stored) as Partial<ProfilePrefs>) };
    } catch {
        return defaultProfilePrefs;
    }
};

const formatSlugLabel = (value: string) =>
    value
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();

    const [savedPrefs, setSavedPrefs] = useState<ProfilePrefs>(getStoredProfilePrefs);
    const [nameDraft, setNameDraft] = useState<string | null>(null);
    const [emailDraft, setEmailDraft] = useState<string | null>(null);
    const [targetRole, setTargetRole] = useState(savedPrefs.targetRole);
    const [experienceLevel, setExperienceLevel] = useState(savedPrefs.experienceLevel);
    const [bio, setBio] = useState(savedPrefs.bio);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const name = nameDraft ?? user?.name ?? "";
    const email = emailDraft ?? user?.email ?? "";

    const isDirty = useMemo(() => {
        const baselineName = user?.name ?? "";
        const baselineEmail = user?.email ?? "";

        return (
            name.trim() !== baselineName ||
            email.trim() !== baselineEmail ||
            targetRole !== savedPrefs.targetRole ||
            experienceLevel !== savedPrefs.experienceLevel ||
            bio.trim() !== savedPrefs.bio
        );
    }, [bio, email, experienceLevel, name, savedPrefs.bio, savedPrefs.experienceLevel, savedPrefs.targetRole, targetRole, user?.email, user?.name]);

    const onFieldChange = (update: () => void) => {
        update();
        if (saveStatus === "saved") {
            setSaveStatus("idle");
        }
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const onSave = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setErrorMessage("Name is required.");
            return;
        }

        if (!trimmedEmail) {
            setErrorMessage("Email is required.");
            return;
        }

        setSaveStatus("saving");
        setErrorMessage(null);

        try {
            const updatedUser = await updateProfile({ name: trimmedName, email: trimmedEmail });
            const profilePrefs: ProfilePrefs = {
                targetRole,
                experienceLevel,
                bio: bio.trim(),
            };

            window.localStorage.setItem(PROFILE_PREFS_STORAGE_KEY, JSON.stringify(profilePrefs));

            const nextSnapshot = {
                targetRole: profilePrefs.targetRole,
                experienceLevel: profilePrefs.experienceLevel,
                bio: profilePrefs.bio,
            };

            setNameDraft(updatedUser.name);
            setEmailDraft(updatedUser.email);
            setBio(profilePrefs.bio);
            setSavedPrefs(nextSnapshot);
            setSaveStatus("saved");
        } catch (error: any) {
            const message = error?.response?.data?.message ?? "Unable to save profile changes.";
            setSaveStatus("idle");
            setErrorMessage(message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-4 md:px-6 md:py-5">
            <section className="rounded-2xl border bg-muted/40 p-4 md:p-5">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
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

            <section className="grid gap-3 lg:grid-cols-[1fr_320px]">
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
                                    value={name}
                                    onChange={(event) => onFieldChange(() => setNameDraft(event.target.value))}
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
                                    type="email"
                                    value={email}
                                    onChange={(event) => onFieldChange(() => setEmailDraft(event.target.value))}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target role</label>
                                <Select value={targetRole} onValueChange={(value) => onFieldChange(() => setTargetRole(value))}>
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
                                <Select
                                    value={experienceLevel}
                                    onValueChange={(value) => onFieldChange(() => setExperienceLevel(value))}
                                >
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
                                    onFieldChange(() => setBio(event.target.value));
                                }}
                                placeholder="Write 3-5 lines about your strengths, goals, and recent achievements."
                                className="min-h-28"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={onSave} disabled={!isDirty || saveStatus === "saving"}>
                                <Save className="h-4 w-4" />
                                {saveStatus === "saving" ? "Saving..." : "Save Profile"}
                            </Button>
                            {saveStatus === "saved" && <p className="text-sm text-emerald-600">Profile changes saved.</p>}
                            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Profile Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="rounded-md border p-3">
                                <p className="mb-1 flex items-center gap-2 font-medium">
                                    <Briefcase className="h-4 w-4 text-amber-600" />
                                    Focus
                                </p>
                                <p className="text-muted-foreground">{formatSlugLabel(targetRole)}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="mb-1 font-medium">Experience Level</p>
                                <p className="text-muted-foreground">{formatSlugLabel(experienceLevel)}</p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="mb-1 font-medium">Bio status</p>
                                <p className={bio.trim() ? "text-emerald-600" : "text-muted-foreground"}>
                                    {bio.trim() ? "\u2713 Complete" : "Add a short bio to improve recommendations"}
                                </p>
                            </div>
                            <div className="rounded-md border p-3">
                                <p className="mb-2 font-medium">Profile completion</p>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Overall</span>
                                        <span className="font-medium text-foreground">{bio.trim() ? "100%" : "75%"}</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-amber-500 transition-all"
                                            style={{ width: bio.trim() ? "100%" : "75%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Prep Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            {[
                                "Keep your target role specific to get better AI suggestions.",
                                "Set your experience level accurately for realistic interview scoring.",
                                "A complete bio improves resume and interview personalization.",
                            ].map((tip) => (
                                <p key={tip} className="flex items-start gap-2 rounded-md border p-3">
                                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                                    {tip}
                                </p>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
