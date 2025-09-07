import { useState, useEffect, useCallback } from 'react';

export const availableLanguages = {
    en: 'English',
    es: 'Español',
    ar: 'العربية'
};

// A simple in-memory cache to store translations after fetching.
// This prevents re-fetching on component re-renders.
let translationsCache: Record<string, Record<string, string>> | null = null;

export const useTranslation = () => {
    // Initialize state from cache if available
    const [translations, setTranslations] = useState<Record<string, Record<string, string>> | null>(translationsCache);

    const [language, setLanguage] = useState<string>(() => {
        try {
            return localStorage.getItem('httpCodeLanguage') || 'en';
        } catch (e) {
            console.error("Failed to read language from localStorage", e);
            return 'en';
        }
    });

    useEffect(() => {
        // Fetch all translations on initial mount only if they haven't been loaded yet.
        if (!translations) {
            Promise.all([
                fetch('./locales/en.json').then(res => res.json()),
                fetch('./locales/es.json').then(res => res.json()),
                fetch('./locales/ar.json').then(res => res.json())
            ]).then(([en, es, ar]) => {
                const loadedTranslations = { en, es, ar };
                translationsCache = loadedTranslations; // Cache the result for subsequent hook uses
                setTranslations(loadedTranslations);
            }).catch(err => {
                console.error("Failed to load translation files", err);
                setTranslations({}); // Set to an empty object on failure to prevent re-fetching
            });
        }
    }, [translations]);


    useEffect(() => {
        try {
            localStorage.setItem('httpCodeLanguage', language);
            document.documentElement.lang = language;
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        } catch (e) {
            console.error("Failed to save language to localStorage", e);
        }
    }, [language]);

    const t = useCallback((key: string, replacements?: Record<string, string>): string => {
        // If translations are not loaded yet, return the key as a fallback.
        if (!translations) {
            return key;
        }
        
        let translation = translations[language]?.[key] || translations['en']?.[key] || key;
        
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }
        return translation;
    }, [language, translations]);

    return { language, setLanguage, t, availableLanguages };
};
