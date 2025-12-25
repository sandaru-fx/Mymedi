
import { GoogleGenAI, Type } from "@google/genai";
import { MedicineInfo, Language, InteractionResult, PharmacyLocation, DosageSchedule, SymptomAnalysis, EmergencyInfo } from "../types";

export const fetchMedicineDetails = async (
  medicineName: string,
  language: Language
): Promise<MedicineInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are a professional medical assistant.
    Medicine Name: "${medicineName}"
    Target Language: "${language}"
    
    Provide:
    1. Description: Simple overview.
    2. Uses: Primary conditions it treats.
    3. How to Use: Basic dosage/timing rules.
    4. Price Range: Estimated LKR/USD market range.
    5. Side Effects: A list of 3-5 common side effects.
    6. Food Interactions: Any food or drinks to avoid (e.g., alcohol, dairy).
    7. Disclaimer: Safety warning.
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicineName: { type: Type.STRING },
            description: { type: Type.STRING },
            uses: { type: Type.STRING },
            howToUse: { type: Type.STRING },
            priceRange: { type: Type.STRING },
            sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
            foodInteractions: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: ["medicineName", "description", "uses", "howToUse", "priceRange", "sideEffects", "foodInteractions", "disclaimer"],
        },
      },
    });
    return JSON.parse(response.text || '{}') as MedicineInfo;
  } catch (error) {
    throw new Error("Failed to retrieve medicine info.");
  }
};

export const fetchEmergencyInstructions = async (
  situation: string,
  language: Language
): Promise<EmergencyInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    URGENT: Provide immediate first-aid instructions for the following emergency: "${situation}"
    Target Language: "${language}"
    If in Sri Lanka, the emergency contact is 1990 (Suwa Seriya).
    
    Provide:
    1. immediateActions: A list of 3-5 critical steps to take NOW.
    2. thingsToAvoid: A list of dangerous actions to avoid.
    3. emergencyContact: The local emergency number (e.g., 1990).
    4. professionalAdvice: A brief professional summary.
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            situation: { type: Type.STRING },
            immediateActions: { type: Type.ARRAY, items: { type: Type.STRING } },
            thingsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
            emergencyContact: { type: Type.STRING },
            professionalAdvice: { type: Type.STRING },
          },
          required: ["situation", "immediateActions", "thingsToAvoid", "emergencyContact", "professionalAdvice"],
        },
      },
    });
    return JSON.parse(response.text || '{}') as EmergencyInfo;
  } catch (error) {
    throw new Error("Failed to fetch emergency instructions.");
  }
};

export const analyzeSymptoms = async (
  symptoms: string,
  language: Language
): Promise<SymptomAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As a diagnostic assistant, analyze these symptoms: "${symptoms}"
    Target Language: "${language}"
    Provide:
    1. possibleConditions: Exactly 3 most likely conditions as a list.
    2. Advice: Practical steps to take.
    3. SuggestedMeds: Common OTC medicines for relief.
    4. Urgency: Low, Medium, or High.
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possibleConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING },
            suggestedMeds: { type: Type.ARRAY, items: { type: Type.STRING } },
            urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          },
          required: ["possibleConditions", "advice", "suggestedMeds", "urgency"],
        },
      },
    });
    return JSON.parse(response.text || '{}') as SymptomAnalysis;
  } catch (error) {
    throw new Error("Symptom analysis failed.");
  }
};

export const checkInteractions = async (
  medicines: string[],
  language: Language
): Promise<InteractionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze drug interactions for: ${medicines.join(", ")}.
    Language: ${language}.
    Provide risk level, summary, and details.
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
            summary: { type: Type.STRING },
            details: { type: Type.STRING },
          },
          required: ["riskLevel", "summary", "details"],
        },
      },
    });
    return JSON.parse(response.text || '{}') as InteractionResult;
  } catch (error) {
    throw new Error("Failed to check interactions.");
  }
};

export const generateDosageSchedule = async (
  medicines: string[],
  language: Language
): Promise<DosageSchedule> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Create a safe daily dosage schedule for these medicines: ${medicines.join(", ")}.
    Organize them into Morning, Afternoon, Evening, and Night.
    Language: ${language}.
    Notes should include "with food" or "empty stomach" advice.
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            morning: { type: Type.ARRAY, items: { type: Type.STRING } },
            afternoon: { type: Type.ARRAY, items: { type: Type.STRING } },
            evening: { type: Type.ARRAY, items: { type: Type.STRING } },
            night: { type: Type.ARRAY, items: { type: Type.STRING } },
            notes: { type: Type.STRING },
          },
          required: ["morning", "afternoon", "evening", "night", "notes"],
        },
      },
    });
    return JSON.parse(response.text || '{}') as DosageSchedule;
  } catch (error) {
    throw new Error("Failed to generate schedule.");
  }
};

export const findNearbyPharmacies = async (
  location: { lat: number; lng: number }
): Promise<PharmacyLocation[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 3 closest open pharmacies near coordinates (${location.lat}, ${location.lng}). Use Google Maps to verify they are currently in that area.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        }
      },
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        name: c.maps.title,
        uri: c.maps.uri
      }));
  } catch (error) {
    return [];
  }
};

export const identifyMedicineFromImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cleanBase64 = base64Image.split(',')[1] || base64Image;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: "Identify the medicine name. Return ONLY the name." }
        ]
      }
    });
    return response.text?.trim() || "";
  } catch (error) {
    throw new Error("Image identification failed.");
  }
};
