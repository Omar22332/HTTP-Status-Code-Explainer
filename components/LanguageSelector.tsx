import React from 'react';
import { GlobeIcon } from './icons/GlobeIcon';

interface LanguageSelectorProps {
    language: string;
    setLanguage: (lang: string) => void;
    availableLanguages: Record<string, string>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage, availableLanguages }) => {
    return (
        <div className="relative">
            <label htmlFor="language-select" className="sr-only">Select language</label>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-400 dark:text-gray-500">
                <GlobeIcon className="w-5 h-5" />
            </div>
            <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full ps-10 p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 appearance-none"
            >
                {Object.entries(availableLanguages).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
        </div>
    );
};