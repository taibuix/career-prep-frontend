"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "career-prep-theme";
const THEME_CHANGE_EVENT = "career-prep-theme-change";

const getThemeFromDom = (): Theme => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const subscribeToTheme = (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => onStoreChange();

    window.addEventListener("storage", handler);
    window.addEventListener(THEME_CHANGE_EVENT, handler);
    media.addEventListener("change", handler);

    return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(THEME_CHANGE_EVENT, handler);
        media.removeEventListener("change", handler);
    };
};

const applyTheme = (theme: Theme) => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribeToTheme, getThemeFromDom, () => "light");

    const handleToggleTheme = () => {
        const nextTheme: Theme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="fixed right-4 bottom-4 z-50 rounded-full shadow-lg md:right-6 md:bottom-6"
            onClick={handleToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
    );
}
