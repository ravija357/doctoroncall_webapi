"use client";

import { useDarkMode } from "@/context/DarkModeContext";
import { Toaster } from "sonner";

export default function ThemeToaster() {
    const { isDark } = useDarkMode();
    return <Toaster richColors position="top-right" theme={isDark ? 'dark' : 'light'} />;
}
