'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // Check localStorage first, then system preference
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemPreference);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update all CSS variables for theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
      root.style.setProperty('--card-bg', '#1a1a1a');
      root.style.setProperty('--card-border', '#333333');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#d1d5db');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--accent', '#667eea');
      root.style.setProperty('--accent-hover', '#7c3aed');
      root.style.setProperty('--border', '#333333');
      root.style.setProperty('--input-bg', '#2a2a2a');
      root.style.setProperty('--input-border', '#4a4a4a');
      root.style.setProperty('--button-primary', '#667eea');
      root.style.setProperty('--button-primary-hover', '#7c3aed');
      root.style.setProperty('--button-secondary', '#2a2a2a');
      root.style.setProperty('--button-secondary-hover', '#3a3a3a');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--header-bg', '#1a1a1a');
      root.style.setProperty('--nav-bg', '#1a1a1a');
      root.style.setProperty('--footer-bg', '#1a1a1a');
    } else {
      root.style.setProperty('--background', '#ffffff');
      root.style.setProperty('--foreground', '#171717');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-border', '#e5e7eb');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--accent', '#667eea');
      root.style.setProperty('--accent-hover', '#5a67d8');
      root.style.setProperty('--border', '#e5e7eb');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--input-border', '#d1d5db');
      root.style.setProperty('--button-primary', '#667eea');
      root.style.setProperty('--button-primary-hover', '#5a67d8');
      root.style.setProperty('--button-secondary', '#f3f4f6');
      root.style.setProperty('--button-secondary-hover', '#e5e7eb');
      root.style.setProperty('--shadow', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--header-bg', '#ffffff');
      root.style.setProperty('--nav-bg', '#ffffff');
      root.style.setProperty('--footer-bg', '#f9fafb');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
