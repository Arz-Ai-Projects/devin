import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
