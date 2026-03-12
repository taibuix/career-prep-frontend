"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { registerUser } from "@/app/(auth)/api";

// Zod schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setServerError(null);
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
            });
            router.push("/dashboard");
        } catch (error: any) {
            setServerError(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <Card className="w-full rounded-xl border-0 bg-transparent shadow-none">
            <CardHeader className="pb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Get started</p>
                <CardTitle className="text-3xl tracking-tight">Create Account</CardTitle>
                <p className="text-sm text-muted-foreground">Set up your prep workspace in under a minute.</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            placeholder="Jane Doe"
                            className="h-12 text-base dark:border-border dark:bg-background/70"
                            autoComplete="name"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="name@example.com"
                            type="email"
                            className="h-12 text-base dark:border-border dark:bg-background/70"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <Input
                                placeholder="At least 6 characters"
                                type={showPassword ? "text" : "password"}
                                className="h-12 pr-11 text-base dark:border-border dark:bg-background/70"
                                autoComplete="new-password"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <div className="relative">
                            <Input
                                placeholder="Re-enter password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="h-12 pr-11 text-base dark:border-border dark:bg-background/70"
                                autoComplete="new-password"
                                {...register("confirmPassword")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((value) => !value)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {serverError && (
                        <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                            {serverError}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="h-12 w-full text-base"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Register"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}

