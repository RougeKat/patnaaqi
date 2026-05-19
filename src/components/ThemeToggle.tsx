import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Lazily read from localStorage to avoid flash of wrong theme
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      return 'dark';
    }
    document.documentElement.classList.remove('dark');
    return 'light';
  });

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[var(--color-surface-secondary-light)] dark:hover:bg-[var(--color-surface-secondary-dark)] transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[var(--color-text-secondary-light)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--color-text-secondary-dark)]" />
      )}
    </button>
  );
}
