const Medicine = require('../models/Medicine');
const xlsx = require('xlsx');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Report = require('../models/Report');

// GET all medicines with Pagination and Search
const getAllMedicines = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = search
            ? {
                $or: [
                    { medicineName: { $regex: search, $options: 'i' } },
                    { uses: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const total = await Medicine.countDocuments(query);
        const medicines = await Medicine.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            medicines,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch medicines" });
    }
};

// ADD new medicine
const addMedicine = async (req, res) => {
    try {
        const newMedicine = new Medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        console.error("Add Medicine Error:", error);
        res.status(500).json({ error: "Failed to add medicine. Check if name already exists." });
    }
};

// UPDATE medicine
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ error: "Failed to update medicine" });
    }
};

// DELETE medicine
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        await Medicine.findByIdAndDelete(id);
        res.json({ message: "Medicine deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete medicine" });
    }
};

// BULK UPLOAD medicines
const bulkUploadMedicines = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        let successCount = 0;
        let errors = [];

        for (const row of data) {
            try {
                const medicineData = {
                    medicineName: row.Name || row.medicineName,
                    description: row.Description || row.description || "No description",
                    uses: row.Uses || row.uses || "General",
                    priceRange: row.Price || row.priceRange || "N/A",
                    howToUse: row.HowToUse || row.howToUse || "As directed",
                    image: ""
                };

                if (medicineData.medicineName) {
                    await Medicine.create(medicineData);
                    successCount++;
                }
            } catch (err) {
                errors.push(`Failed to add ${row.Name}: ${err.message}`);
            }
        }

        res.json({ message: `Successfully added ${successCount} medicines`, errors });
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.status(500).json({ error: "Bulk upload failed" });
    }
};

// AI ANALYTICS - GENERATE INSIGHTS
const getAIAnalytics = async (req, res) => {
    try {
        const reports = await Report.find({});

        // 1. Calculate Summary Stats
        const districtCounts = reports.reduce((acc, curr) => {
            if (curr.district) acc[curr.district] = (acc[curr.district] || 0) + 1;
            return acc;
        }, {});

        const medicineCounts = reports.reduce((acc, curr) => {
            acc[curr.medicineName] = (acc[curr.medicineName] || 0) + 1;
            return acc;
        }, {});

        // 2. Prepare Prompt
        const topDistricts = Object.entries(districtCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([d, c]) => `${d}: ${c} reports`).join(", ");

        const topMedicines = Object.entries(medicineCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([m, c]) => `${m}: ${c} reports`).join(", ");

        const prompt = `Analyze these pharmacy price violation reports from Sri Lanka. 
        Data: 
        - Total Reports: ${reports.length}
        - Top Districts for violations: ${topDistricts}
        - Most Reported Medicines: ${topMedicines}

        Provide a 3-sentence executive summary for the Ministry of Health administrator. 
        Focus on identifying the worst affected area and the most problematic medicine. 
        Use a professional, urgent tone. Do not use markdown formatting like bold or headers.`;

        // 3. Call Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ insight: text });

    } catch (error) {
        console.error("AI Analytics Error:", error);
        res.status(500).json({ error: "Failed to generate AI insights" });
    }
};

module.exports = {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    bulkUploadMedicines,
    getAIAnalytics
};
