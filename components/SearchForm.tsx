import React from 'react';

interface SearchFormProps {
    onSubmit: (code: string) => void;
    onSurpriseMe: () => void;
    code: string;
    setCode: (code: string) => void;
    isLoading: boolean;
    t: (key: string) => string;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, onSurpriseMe, code, setCode, isLoading, t }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(code);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 3) {
            setCode(value);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder={t('searchInputPlaceholder')}
                pattern="\d{3}"
                maxLength={3}
                className="w-full flex-grow bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition-all duration-200"
                disabled={isLoading}
                aria-label={t('searchInputPlaceholder')}
            />
            <div className="flex w-full sm:w-auto gap-2">
                 <button
                    type="submit"
                    className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    disabled={isLoading}
                >
                    {isLoading ? t('thinkingButton') : t('explainButton')}
                </button>
                <button
                    type="button"
                    onClick={onSurpriseMe}
                    className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 px-6 py-3 bg-gray-200 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    disabled={isLoading}
                    aria-label={t('surpriseMeAriaLabel')}
                >
                    {t('surpriseMeButton')}
                </button>
            </div>
        </form>
    );
};