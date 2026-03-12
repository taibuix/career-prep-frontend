"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "@/app/(auth)/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z.object({
    email: z.email(),
    password: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            setServerError(null);
            await loginUser(data);
            router.push("/dashboard");

        } catch (error: any) {
            setServerError(error.response?.data?.message || "Login failed");
        }
        setIsSubmitting(false);
    };

    return (
        <Card className="w-full rounded-xl border-0 bg-transparent shadow-none">
            <CardHeader className="pb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">Welcome back</p>
                <CardTitle className="text-3xl tracking-tight">Login</CardTitle>
                <p className="text-sm text-muted-foreground">Continue your interview and resume prep.</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                placeholder="Enter password"
                                type={showPassword ? "text" : "password"}
                                className="h-12 pr-11 text-base dark:border-border dark:bg-background/70"
                                autoComplete="current-password"
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
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Need an account?{" "}
                        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}

