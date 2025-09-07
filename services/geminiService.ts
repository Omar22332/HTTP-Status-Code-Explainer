import { GoogleGenAI, Type } from "@google/genai";
import type { StatusCodeInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The official IANA name for the HTTP status code (e.g., 'Not Found', 'OK', 'Internal Server Error'). This field must not be translated from English."
        },
        explanation: {
            type: Type.STRING,
            description: "A simple, one or two-sentence explanation of what this status code means, suitable for a beginner."
        },
        analogy: {
            type: Type.STRING,
            description: "A creative and memorable analogy to help someone understand and remember the status code. For example, for 404, 'It's like knocking on a door that doesn't exist.'"
        }
    },
    required: ["name", "explanation", "analogy"]
};

const languageMap: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    ar: 'Arabic',
};

export const getHttpStatusCodeExplanation = async (code: string, language: string): Promise<StatusCodeInfo> => {
    const targetLanguage = languageMap[language] || 'English';
    const prompt = `Explain the HTTP status code ${code}. Provide the "explanation" and "analogy" in ${targetLanguage}. The "name" field must be the official IANA name and must not be translated.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        return {
            code,
            name: data.name,
            explanation: data.explanation,
            analogy: data.analogy,
        };
    } catch (error) {
        console.error("Error fetching explanation from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get explanation for status code ${code}. ${error.message}`);
        }
        throw new Error(`An unknown error occurred while fetching explanation for status code ${code}.`);
    }
};
