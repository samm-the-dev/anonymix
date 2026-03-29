import { useState, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
type StoredPreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'anonymix-theme';

function getStoredPreference(): StoredPreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Storage unavailable (privacy mode, etc.)
  }
  return 'dark';
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useSystemTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => cb();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    },
    getSystemTheme,
  );
}

export function useTheme() {
  const [preference, setPreference] = useState<StoredPreference>(getStoredPreference);
  const systemTheme = useSystemTheme();
  const theme: Theme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // Storage unavailable
    }
  }, [preference]);

  const toggleTheme = () => {
    setPreference((prev) => {
      const current = prev === 'system' ? systemTheme : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  };

  return { theme, toggleTheme } as const;
}
