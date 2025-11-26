import { GoogleGenAI, Type } from "@google/genai";
import { CategorizedResults, DifficultyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWords = async (
  pattern: string,
  difficulty: DifficultyLevel
): Promise<CategorizedResults> => {
  if (!pattern || pattern.trim().length === 0) {
    throw new Error("Please enter a letter combination.");
  }

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `You are a helpful English vocabulary assistant for students. 
  Your task is to find English words containing a specific letter combination.
  
  Strictly adhere to the following rules:
  1. Filter words based on the requested difficulty level: ${difficulty}.
  2. Categorize results into three groups based on where the pattern appears: 'start' (starts with pattern), 'middle' (contains pattern in the middle), 'end' (ends with pattern).
  3. Provide the accurate International Phonetic Alphabet (IPA) transcription for each word.
  4. Limit each category to a maximum of 10 words.
  5. Ensure the words are appropriate for the selected education level.
  6. If no words are found for a category, return an empty array for that category.
  `;

  const prompt = `Find words containing the letter combination: "${pattern}".`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            start: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                },
                required: ["word", "ipa"],
              },
            },
            middle: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                },
                required: ["word", "ipa"],
              },
            },
            end: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  ipa: { type: Type.STRING },
                },
                required: ["word", "ipa"],
              },
            },
          },
          required: ["start", "middle", "end"],
        },
      },
    });

    if (response.text) {
      const parsedData = JSON.parse(response.text) as CategorizedResults;
      return parsedData;
    } else {
      throw new Error("No data returned from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch words. Please try again.");
  }
};