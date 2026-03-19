"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/src/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    return <>{children}</>;
}
