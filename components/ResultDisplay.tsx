import React, { useState } from 'react';
import type { StatusCodeInfo } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ShareIcon } from './icons/ShareIcon';

interface ResultDisplayProps {
    data: StatusCodeInfo;
    t: (key: string, replacements?: Record<string, string>) => string;
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    textContent: string;
    t: (key: string, replacements?: Record<string, string>) => string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, textContent, t }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!navigator.clipboard) {
            console.error("Clipboard API not available");
            return;
        }
        try {
            await navigator.clipboard.writeText(textContent);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }
    };

    return (
        <div className="relative group bg-sky-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 backdrop-blur-sm">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/40 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 hover:text-gray-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                aria-label={t('copyToClipboardAriaLabel', { title: title })}
            >
                {isCopied ? (
                    <CheckIcon className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                ) : (
                    <ClipboardIcon className="w-5 h-5" />
                )}
            </button>
            <div className="flex items-center mb-3">
                <div className="text-sky-500 dark:text-sky-400">{icon}</div>
                <h3 className="ml-3 text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{textContent}</p>
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data, t }) => {
    const [isShared, setIsShared] = useState(false);

    const handleShare = async () => {
        const url = new URL(window.location.href);
        url.searchParams.set('code', data.code);
        
        try {
            await navigator.clipboard.writeText(url.toString());
            setIsShared(true);
            setTimeout(() => setIsShared(false), 2000);
        } catch (err) {
            console.error("Failed to copy share link:", err);
        }
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
            <header className="relative text-center p-6 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <button
                    onClick={handleShare}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-white/40 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 hover:text-gray-800 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                    aria-label={t('shareResultAriaLabel')}
                >
                    {isShared ? (
                        <CheckIcon className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                    ) : (
                        <ShareIcon className="w-5 h-5" />
                    )}
                </button>
                <h2 className="text-5xl font-bold text-teal-500 dark:text-teal-300">{data.code}</h2>
                <p className="text-2xl font-medium text-gray-800 dark:text-white mt-2">{data.name}</p>
            </header>

            <InfoCard 
                icon={<BookOpenIcon className="w-7 h-7" />} 
                title={t('simpleExplanation')} 
                textContent={data.explanation} 
                t={t}
            />

            <InfoCard 
                icon={<LightBulbIcon className="w-7 h-7" />} 
                title={t('analogy')} 
                textContent={data.analogy} 
                t={t}
            />
        </div>
    );
};