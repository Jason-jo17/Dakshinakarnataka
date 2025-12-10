import { GoogleGenAI, Type } from "@google/genai";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { GeminiResponse } from "../types/ai";
import type { Institution } from "../types/institution";

let ai: GoogleGenAI | null = null;
let savedApiKey: string = "";

export const initializeGenAI = (apiKey: string) => {
    ai = new GoogleGenAI({ apiKey });
    savedApiKey = apiKey;
};

export const fetchLocationDetails = async (
    query: string
): Promise<GeminiResponse> => {
    if (!ai) {
        throw new Error("API Key not initialized");
    }

    try {
        const model = "gemini-1.5-flash";
        const prompt = `Tell me the exact address, rating, and a very brief description (one sentence) for: ${query}. 
    Also, find its precise geographic location (Latitude and Longitude) and return it in the text.`;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
            },
        });

        const candidate = response.candidates?.[0];
        if (!candidate || !candidate.content || !candidate.content.parts) throw new Error("No response from Gemini");

        return {
            text: candidate.content.parts[0].text || "No details found.",
            groundingChunks: candidate.groundingMetadata?.groundingChunks || [],
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const fetchSearchInfo = async (
    query: string
): Promise<GeminiResponse> => {
    if (!ai) throw new Error("API Key not initialized");

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: query,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        const candidate = response.candidates?.[0];
        if (!candidate || !candidate.content || !candidate.content.parts) throw new Error("No response from Gemini");

        return {
            text: candidate.content.parts[0].text || "No info found",
            groundingChunks: candidate.groundingMetadata?.groundingChunks || []
        };

    } catch (error) {
        console.error("Gemini Search Error", error);
        throw error;
    }
}

export const discoverPlaces = async (query: string): Promise<Institution[]> => {
    if (!ai) throw new Error("API Key not initialized");

    try {
        const prompt = `Identify 5 to 10 locations in Dakshina Kannada matching the query: "${query}".
        They must be real physical locations.
        Return a JSON array where each object has:
        - name: string
        - address: string (short address)
        - lat: number
        - lng: number
        - description: string (very short)
        - category: string (one of 'Engineering', 'Polytechnic', 'ITI', 'Training', 'University', 'Research', 'Hospital', 'Company')
        
        Do not explain. Just return JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            address: { type: Type.STRING },
                            lat: { type: Type.NUMBER },
                            lng: { type: Type.NUMBER },
                            description: { type: Type.STRING },
                            category: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const text = response.text;
        if (!text) return [];

        const rawData = JSON.parse(text);

        return rawData.map((item: any, index: number) => ({
            id: `discovered-${Date.now()}-${index}`,
            name: item.name,
            category: item.category || 'Company',
            type: 'Private',
            location: {
                address: item.address,
                landmark: '',
                area: 'Dakshina Kannada',
                taluk: 'Mangaluru',
                district: 'Dakshina Kannada',
                state: 'Karnataka',
                pincode: '',
                coordinates: { lat: item.lat, lng: item.lng },
                googleMapsUrl: `https://maps.google.com/?q=${item.lat},${item.lng}`
            },
            contact: { website: '' },
            metadata: { verified: false, lastUpdated: new Date().toISOString(), source: 'AI Discovery' }
        }));

    } catch (error) {
        console.error("Discovery Error", error);
        throw error;
    }
}

export const performIntelligentSearch = async (query: string, dataContext: string = ''): Promise<{
    thoughtProcess: string[];
    answer: string;
    recommendedView: 'institutions' | 'jobs' | 'market_analysis' | 'skill_gap';
    filters: {
        skills: string[];
        location: string | null;
        category: string | null;
        type: string | null;
    };
}> => {
    if (!savedApiKey) throw new Error("API Key not initialized");

    try {
        const genAI = new GoogleGenerativeAI(savedApiKey);

        const systemInstruction = `You are an intelligent data analyst for the Dakshina Kannada District Education & Industry Dashboard.

        Goal: Understand user intent, explain reasoning, and select the best DASHBOARD VIEW to visualize the answer.

        Available Views (Tools):
        - 'institutions': For finding colleges, schools, training centers.
        - 'jobs': For finding active job openings or companies hiring.
        - 'market_analysis': For broad industry trends, demand supply, or company landscapes (COEs, etc.).
        - 'skill_gap': For specific skill-related queries (e.g., "Where can I learn AI?").

        RESPONSE FORMAT (JSON):
        {
            "thoughtProcess": ["Step 1...", "Step 2..."],
            "answer": "Natural language summary...",
            "recommendedView": "one_of_the_views_above",
            "filters": {
                "skills": ["extracted", "skills"],
                "location": "location_or_null",
                "category": "category_or_null",
                "type": "Company_or_Education_or_null"
            }
        }`;

        const userPrompt = `
        User Query: "${query}"

        REAL-TIME DATA CONTEXT:
        ${dataContext}
        
        Analyze the query based on the provided context and return the JSON response.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        thoughtProcess: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        answer: { type: SchemaType.STRING },
                        recommendedView: { type: SchemaType.STRING, enum: ['institutions', 'jobs', 'market_analysis', 'skill_gap'] },
                        filters: {
                            type: SchemaType.OBJECT,
                            properties: {
                                skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                                location: { type: SchemaType.STRING, nullable: true },
                                category: { type: SchemaType.STRING, nullable: true },
                                type: { type: SchemaType.STRING, nullable: true }
                            }
                        }
                    }
                }
            }
        });

        const result = await model.generateContent(userPrompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);

        // Ensure defaults if AI misses fields
        return {
            thoughtProcess: parsed.thoughtProcess || [],
            answer: parsed.answer || "Here is what I found.",
            recommendedView: parsed.recommendedView || 'institutions',
            filters: {
                skills: parsed.filters?.skills || [],
                location: parsed.filters?.location || null,
                category: parsed.filters?.category || null,
                type: parsed.filters?.type || null
            }
        };

    } catch (error) {
        console.error("Query Parse Error", error);
        return {
            thoughtProcess: ["Failed to analyze query", "Error: " + String(error)],
            answer: "I encountered an error analyzing your request. Showing general results.",
            recommendedView: 'institutions',
            filters: { skills: [], location: null, category: null, type: null }
        };
    }
};
