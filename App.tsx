import React, { useState, useCallback, useEffect } from 'react';
import { getHttpStatusCodeExplanation } from './services/geminiService';
import type { StatusCodeInfo } from './types';
import { SearchForm } from './components/SearchForm';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import { HttpCodeIcon } from './components/icons/HttpCodeIcon';
import { History } from './components/History';
import { useTranslation } from './hooks/useTranslation';
import { LanguageSelector } from './components/LanguageSelector';
import { useTheme } from './hooks/useTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';


const INTERESTING_STATUS_CODES = [
  '100', '102', '200', '201', '202', '204', '206', '300', '301', '302', '304', 
  '307', '308', '400', '401', '403', '404', '405', '406', '408', '410', '418', 
  '429', '451', '500', '501', '502', '503', '504'
];

const App: React.FC = () => {
    const [inputCode, setInputCode] = useState<string>('');
    const [result, setResult] = useState<StatusCodeInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const { language, setLanguage, t, availableLanguages } = useTranslation();
    const [theme, toggleTheme] = useTheme();

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('httpCodeHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
        }
    }, []);

    const updateHistory = (code: string) => {
        setHistory(prevHistory => {
            const newHistory = [code, ...prevHistory.filter(c => c !== code)].slice(0, 5);
            try {
                localStorage.setItem('httpCodeHistory', JSON.stringify(newHistory));
            } catch (e) {
                console.error("Failed to save history to localStorage", e);
            }
            return newHistory;
        });
    };

    const handleSearch = useCallback(async (code: string) => {
        if (!code || !/^\d{3}$/.test(code)) {
            setError(t('errorInvalidCode'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setInputCode(code);

        try {
            const data = await getHttpStatusCodeExplanation(code, language);
            setResult(data);
            updateHistory(code);
        } catch (err) {
            if (err instanceof Error) {
                setError(t('errorFetchFailed', { code: code, error: err.message }));
            } else {
                setError(t('errorDefault'));
            }
        } finally {
            setIsLoading(false);
        }
    }, [language, t]);
    
    // This effect runs once on mount to check for a 'code' query parameter.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const codeFromQuery = params.get('code');
        if (codeFromQuery && /^\d{3}$/.test(codeFromQuery)) {
            handleSearch(codeFromQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Deliberately empty to run only once on initial load.


    const handleSurpriseMe = useCallback(async () => {
        const randomIndex = Math.floor(Math.random() * INTERESTING_STATUS_CODES.length);
        const randomCode = INTERESTING_STATUS_CODES[randomIndex];
        await handleSearch(randomCode);
    }, [handleSearch]);

    const handleClearHistory = () => {
        setHistory([]);
        try {
            localStorage.removeItem('httpCodeHistory');
        } catch (e) {
            console.error("Failed to clear history from localStorage", e);
        }
    };
    
    const InitialState = () => (
        <div className="text-center text-gray-500 dark:text-gray-400 p-8">
            <HttpCodeIcon className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">{t('initialStateTitle')}</h2>
            <p className="mt-2 max-w-md mx-auto">{t('initialStateMessage')}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center p-4 sm:p-6 font-sans transition-colors duration-300">
             <header className="w-full max-w-3xl mb-8 mt-4">
                <div className="flex justify-between items-center">
                    <div></div> {/* Spacer */}
                    <div className="flex items-center gap-2">
                        <LanguageSelector
                            language={language}
                            setLanguage={setLanguage}
                            availableLanguages={availableLanguages}
                        />
                        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} t={t} />
                    </div>
                </div>
                <div className="text-center mt-2 sm:-mt-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-600">
                        {t('headerTitle')}
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        {t('headerSubtitle')}
                    </p>
                </div>
            </header>

            <main className="w-full max-w-xl flex-grow">
                <SearchForm
                    onSubmit={handleSearch}
                    onSurpriseMe={handleSurpriseMe}
                    code={inputCode}
                    setCode={setInputCode}
                    isLoading={isLoading}
                    t={t}
                />
                
                <History 
                  items={history}
                  onItemClick={handleSearch}
                  onClear={handleClearHistory}
                  t={t}
                />

                <div className="mt-8">
                    {isLoading && <LoadingIndicator t={t} />}
                    {error && <ErrorMessage message={error} t={t} />}
                    {result && <ResultDisplay data={result} t={t} />}
                    {!isLoading && !error && !result && <InitialState />}
                </div>
            </main>
            <footer className="w-full text-center p-4 mt-8 text-gray-500 dark:text-gray-500 text-sm">
                <p>{t('footerText')}</p>
            </footer>
        </div>
    );
};

export default App;