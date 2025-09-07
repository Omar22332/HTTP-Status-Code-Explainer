import React from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryProps {
    items: string[];
    onItemClick: (code: string) => void;
    onClear: () => void;
    t: (key: string) => string;
}

export const History: React.FC<HistoryProps> = ({ items, onItemClick, onClear, t }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('recentSearches')}</h3>
                <button
                    onClick={onClear}
                    className="flex items-center text-xs text-gray-500 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    aria-label={t('clearHistoryAriaLabel')}
                >
                    <TrashIcon className="w-4 h-4 me-1" />
                    {t('clearHistory')}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map(code => (
                    <button
                        key={code}
                        onClick={() => onItemClick(code)}
                        className="px-3 py-1 bg-gray-200/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-sky-500"
                    >
                        {code}
                    </button>
                ))}
            </div>
        </div>
    );
};