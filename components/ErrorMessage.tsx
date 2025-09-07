import React from 'react';

interface ErrorMessageProps {
    message: string;
    t: (key: string) => string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, t }) => {
    return (
        <div
            className="bg-red-100/50 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative animate-fade-in"
            role="alert"
        >
            <strong className="font-bold">{t('errorMessagePrefix')} </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
};