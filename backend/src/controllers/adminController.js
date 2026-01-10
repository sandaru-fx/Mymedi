const Medicine = require('../models/Medicine');

// GET all medicines
const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.json(medicines);
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
