const Medicine = require('../models/Medicine');

// GET all medicines
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

module.exports = {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine
};
