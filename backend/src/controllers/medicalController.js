const { GoogleGenAI, SchemaType } = require("@google/genai");

const getMedicineDetails = async (req, res) => {
    const { medicineName, language } = req.body;
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
        You are a professional medical assistant.
        Medicine Name: "${medicineName}"
        Target Language: "${language}"
        
        Provide high-quality medical information following the schema.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = JSON.parse(result.response.text());
        res.json(response);
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to retrieve medicine info." });
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
        const response = JSON.parse(result.response.text());
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
        const response = JSON.parse(result.response.text());
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
