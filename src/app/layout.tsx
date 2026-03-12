import "./globals.css";
import { AuthProvider } from "@/app/(auth)/auth-context";
import ThemeToggle from "@/components/theme/theme-toggle";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function () {
                                try {
                                    var key = "career-prep-theme";
                                    var stored = localStorage.getItem(key);
                                    var theme = stored === "light" || stored === "dark"
                                        ? stored
                                        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                                    document.documentElement.classList.toggle("dark", theme === "dark");
                                } catch (e) {}
                            })();
                        `,
                    }}
                />
            </head>
            <body>
                <AuthProvider>
                    {children}
                    <ThemeToggle />
                </AuthProvider>
            </body>
        </html >
    )
}
