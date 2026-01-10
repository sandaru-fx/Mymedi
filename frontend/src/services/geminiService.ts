import { MedicineInfo, Language, InteractionResult, PharmacyLocation, DosageSchedule, SymptomAnalysis, EmergencyInfo } from "../models/types";
import { API_BASE_URL } from "../config/apiConfig";

export const fetchMedicineDetails = async (
  medicineName: string,
  language: Language,
  token: string
): Promise<MedicineInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/medicine-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ medicineName, language }),
    });
    console.log(`[Frontend] Requesting: ${API_BASE_URL}/medicine-details`); // DEBUG LOG
    if (!response.ok) throw new Error("Failed to retrieve medicine info.");
    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to medical records.");
  }
};

export const fetchEmergencyInstructions = async (
  situation: string,
  language: Language,
  token: string
): Promise<EmergencyInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emergency-instructions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ situation, language }),
    });
    if (!response.ok) throw new Error("Failed to fetch emergency instructions.");
    return await response.json();
  } catch (error) {
    throw new Error("Failed to connect to emergency services.");
  }
};

export const analyzeSymptoms = async (
  symptoms: string,
  language: Language,
  token: string
): Promise<SymptomAnalysis> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-symptoms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ symptoms, language }),
    });
    if (!response.ok) throw new Error("Symptom analysis failed.");
    return await response.json();
  } catch (error) {
    throw new Error("Symptom analysis connection error.");
  }
};

// These functions will be implemented on the backend as needed, keeping placeholders for now
export const checkInteractions = async (
  medicines: string[],
  language: Language
): Promise<InteractionResult> => {
  throw new Error("Interaction check moved to backend - coming soon.");
};

export const generateDosageSchedule = async (
  medicines: string[],
  language: Language
): Promise<DosageSchedule> => {
  throw new Error("Dosage schedule moved to backend - coming soon.");
};

export const findNearbyPharmacies = async (
  location: { lat: number; lng: number }
): Promise<PharmacyLocation[]> => {
  return []; // Simplified for now
};

export const identifyMedicineFromImage = async (base64Image: string): Promise<string> => {
  throw new Error("Image identification moved to backend - coming soon.");
};
