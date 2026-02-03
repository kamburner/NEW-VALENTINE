import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client ONLY if the key is present to avoid runtime crashes if not configured,
// though the app logic will handle the missing key gracefully by not calling this.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateRomanticPoem = async (partnerName: string): Promise<string> => {
  if (!ai) {
    console.warn("API Key missing");
    return "Roses are red, violets are blue, I need an API Key to write a poem for you! (Check configuration)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, very cute, and romantic poem for my wife named ${partnerName}. It should be about asking her to be my Valentine. Keep it under 100 words. Make it sweet and modern.`,
    });

    return response.text || "Could not generate a poem right now, but I love you!";
  } catch (error) {
    console.error("Error generating poem:", error);
    return "Even when the servers are down, my love for you is up! (Error generating poem)";
  }
};
