const { GoogleGenAI, SchemaType } = require("@google/genai");
const Medicine = require('../models/Medicine');

const getMedicineDetails = async (req, res) => {
    const { medicineName, language } = req.body;
    console.log(`[Medicine Search] Fetching details for: ${medicineName} (${language})`);

    try {
        // 1. DATABASE CHECK (Priority 1)
        const dbMedicine = await Medicine.findOne({
            medicineName: medicineName.toLowerCase().trim()
        });

        if (dbMedicine) {
            console.log(`[Medicine Search] Found in DATABASE: ${medicineName}`);
            return res.json({
                medicineName: dbMedicine.displayName || dbMedicine.medicineName,
                description: dbMedicine.description,
                uses: dbMedicine.uses,
                howToUse: dbMedicine.howToUse,
                priceRange: dbMedicine.priceRange,
                sideEffects: dbMedicine.sideEffects,
                foodInteractions: dbMedicine.foodInteractions,
                disclaimer: dbMedicine.disclaimer
            });
        }

        // 2. AI GENERATION (Fallback)
        console.log(`[Medicine Search] Not in DB. Asking AI for: ${medicineName}`);
        const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        medicineName: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        uses: { type: SchemaType.STRING },
                        howToUse: { type: SchemaType.STRING },
                        priceRange: { type: SchemaType.STRING },
                        sideEffects: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        foodInteractions: { type: SchemaType.STRING },
                        disclaimer: { type: SchemaType.STRING },
                    },
                    required: ["medicineName", "description", "uses", "howToUse", "priceRange", "sideEffects", "foodInteractions", "disclaimer"],
                },
            },
        });

        const prompt = `
            You are a professional medical assistant with expertise in Sri Lankan pharmaceutical market.
            Medicine Name: "${medicineName}"
            Target Language: "${language}"
            
            Provide comprehensive medical information following the schema.
            
            IMPORTANT FOR PRICE RANGE:
            - Provide an ESTIMATED market price range for Sri Lanka (e.g., "Rs. 150 - 200").
            - This is for INFORMATIONAL PURPOSES ONLY.
            - If exact price is volatile, provide a broad estimate.
            - DO NOT REFUSE TO ANSWER due to price fluctuations. Give a helpful estimate.
            
            IMPORTANT FOR HOW TO USE:
            - Provide step-by-step instructions.
            - Be clear and specific.
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstOpen = text.indexOf('{');
        const lastClose = text.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            text = text.substring(firstOpen, lastClose + 1);
        }

        const response = JSON.parse(text);
        console.log(`[Medicine Search] Successfully retrieved info from AI for: ${medicineName}`);
        res.json(response);

    } catch (error) {
        console.error("Search Error Details:", error);
        res.status(500).json({
            error: "Failed to retrieve medicine info.",
            details: error.message
        });
    }
};

const analyzeSymptoms = async (req, res) => {
    const { symptoms, language } = req.body;
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    possibleConditions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    advice: { type: SchemaType.STRING },
                    suggestedMeds: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    urgency: { type: SchemaType.STRING, enum: ['Low', 'Medium', 'High'] },
                },
                required: ["possibleConditions", "advice", "suggestedMeds", "urgency"],
            },
        },
    });

    const prompt = `
        As a diagnostic assistant, analyze these symptoms: "${symptoms}"
        Target Language: "${language}"
    `;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json\n?|```/g, '');
        const response = JSON.parse(text);
        res.json(response);
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Symptom analysis failed." });
    }
};

const getEmergencyInstructions = async (req, res) => {
    const { situation, language } = req.body;
    const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    situation: { type: SchemaType.STRING },
                    immediateActions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    thingsToAvoid: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    emergencyContact: { type: SchemaType.STRING },
                    professionalAdvice: { type: SchemaType.STRING },
                },
                required: ["situation", "immediateActions", "thingsToAvoid", "emergencyContact", "professionalAdvice"],
            },
        },
    });

    const prompt = `
        URGENT: Provide immediate first-aid instructions for the following emergency: "${situation}"
        Target Language: "${language}"
        If in Sri Lanka, the emergency contact is 1990 (Suwa Seriya).
    `;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json\n?|```/g, '');
        const response = JSON.parse(text);
        res.json(response);
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to fetch emergency instructions." });
    }
};

module.exports = {
    getMedicineDetails,
    analyzeSymptoms,
    getEmergencyInstructions
};
