import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiResponse } from "../types/ai";
import type { Institution } from "../types/institution";

let ai: GoogleGenAI | null = null;

export const initializeGenAI = (apiKey: string) => {
    ai = new GoogleGenAI({ apiKey });
};

export const fetchLocationDetails = async (
    query: string
): Promise<GeminiResponse> => {
    if (!ai) {
        throw new Error("API Key not initialized");
    }

    try {
        const model = "gemini-2.0-flash";
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
            model: "gemini-2.0-flash",
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
            model: "gemini-2.0-flash",
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
