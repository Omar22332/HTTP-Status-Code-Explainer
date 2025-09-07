import { useState, useEffect } from 'react';

export const useTheme = (): [string, () => void] => {
    const [theme, setTheme] = useState<string>(() => {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (e) {
            console.error("Failed to read theme from localStorage", e);
            return 'light';
        }
    });

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        try {
            const root = window.document.documentElement;
            const isDark = theme === 'dark';

            root.classList.remove(isDark ? 'light' : 'dark');
            root.classList.add(theme);

            localStorage.setItem('theme', theme);
        } catch (e) {
            console.error("Failed to save theme to localStorage", e);
        }
    }, [theme]);

    return [theme, toggleTheme];
};
