"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppSession } from "@/lib/auth/session";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getTranslations, localeCookie, type Locale } from "@/lib/i18n";

type SessionContextValue = {
  session: AppSession | null;
  setSession: (session: AppSession | null) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);
const debugLogKey = "soleilroute-debug-log";
const debugLogLimit = 30;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function AppProviders({
  children,
  initialSession,
  initialLocale,
}: {
  children: ReactNode;
  initialSession: AppSession | null;
  initialLocale: Locale;
}) {
  const [session, setSession] = useState<AppSession | null>(initialSession);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  const value = useMemo(
    () => ({
      session,
      setSession,
    }),
    [session],
  );
  const themeValue = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );
  const localeValue = useMemo(
    () => ({
      locale,
      setLocale,
    }),
    [locale],
  );
  const logClientEvent = useCallback(
    (label: string, data?: Record<string, unknown>) => {
      if (process.env.NODE_ENV === "production") {
        return;
      }
      if (typeof window === "undefined") {
        return;
      }
      const payload = {
        timestamp: new Date().toISOString(),
        label,
        data,
      };
      console.info(`[SoleilRoute] ${label}`, data ?? "");
      try {
        const existing = window.sessionStorage.getItem(debugLogKey);
        const entries = existing ? (JSON.parse(existing) as typeof payload[]) : [];
        entries.push(payload);
        if (entries.length > debugLogLimit) {
          entries.splice(0, entries.length - debugLogLimit);
        }
        window.sessionStorage.setItem(debugLogKey, JSON.stringify(entries));
      } catch {
        // noop
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    root.lang = locale;
    document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    try {
      const previous = window.sessionStorage.getItem(debugLogKey);
      if (previous) {
        const entries = JSON.parse(previous) as {
          timestamp: string;
          label: string;
          data?: Record<string, unknown>;
        }[];
        if (entries.length > 0) {
          console.info("[SoleilRoute] previous logs", entries);
        }
        window.sessionStorage.removeItem(debugLogKey);
      }
    } catch {
      // noop
    }
    logClientEvent("AppProviders mounted");
    if (typeof window.performance !== "undefined") {
      const entry = window.performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming | undefined;
      if (entry?.type) {
        logClientEvent("navigation", { type: entry.type });
      }
    }
    return () => {
      logClientEvent("AppProviders unmounted");
    };
  }, [logClientEvent]);

  useEffect(() => {
    logClientEvent("theme changed", { theme });
  }, [logClientEvent, theme]);

  useEffect(() => {
    logClientEvent("locale changed", { locale });
  }, [logClientEvent, locale]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    const logEvent = (label: string) => () => {
      logClientEvent(label, {
        visibility: document.visibilityState,
        url: window.location.href,
      });
    };
    const onVisibility = logEvent("visibilitychange");
    const onPageHide = logEvent("pagehide");
    const onPageShow = logEvent("pageshow");
    const onBeforeUnload = logEvent("beforeunload");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [logClientEvent]);

  return (
    <SessionContext.Provider value={value}>
      <ThemeContext.Provider value={themeValue}>
        <LocaleContext.Provider value={localeValue}>
          <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
        </LocaleContext.Provider>
      </ThemeContext.Provider>
    </SessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useAppSession must be used within AppProviders");
  }
  return context;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within AppProviders");
  }
  return context;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within AppProviders");
  }
  return context;
}

export function useTranslations() {
  const { locale } = useLocale();
  return getTranslations(locale);
}
