"use client";

import { useEffect, useState, ReactNode } from "react";
import { useTheme } from "next-themes";
import { getCookie, setCookie } from "cookies-next";
import { Moon, Sun } from "lucide-react";

interface ThemeSwitcherProps {
  text?: string | null;
  // If children is provided as a render prop, it receives the current theme.
  children?: (props: { theme: string; resolvedTheme: string }) => ReactNode;
}

const ThemeSwitcher = ({ text, children }: ThemeSwitcherProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const themes = ["dark", "light"];

  // Get system theme preference
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    const storedTheme = getCookie("theme");
    setTheme(storedTheme ? (storedTheme as string) : getSystemTheme());
  }, [setTheme]);

  // Function to switch themes
  const cycleTheme = () => {
    const currentTheme = resolvedTheme || theme || "light";
    const nextTheme = themes[(themes.indexOf(currentTheme) + 1) % themes.length] || "light";
    setTheme(nextTheme);
    setCookie("theme", nextTheme, { maxAge: 60 * 60 * 24 * 365 });
  };

  // Prevent rendering until theme is mounted
  if (!mounted) return null;

  return (
    <div
      onClick={cycleTheme}
    >
      {children ? (
        // Render the children as a function passing the current theme data.
        children({ theme: theme || "light", resolvedTheme: resolvedTheme || "light" })
      ) : (
        <>
          {resolvedTheme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          {text && <span className="font-light">{text}</span>}
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
