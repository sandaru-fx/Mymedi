// Common medicines database for autocomplete
const commonMedicines = [
    // Pain Relief & Fever
    'Paracetamol', 'Panadol', 'Aspirin', 'Ibuprofen', 'Brufen', 'Diclofenac', 'Voltaren',

    // Antibiotics
    'Amoxicillin', 'Amoxil', 'Azithromycin', 'Ciprofloxacin', 'Cephalexin', 'Augmentin',

    // Antihistamines & Allergies
    'Cetirizine', 'Loratadine', 'Chlorpheniramine', 'Piriton', 'Avil',

    // Stomach & Digestive
    'Omeprazole', 'Ranitidine', 'Antacid', 'Domperidone', 'Loperamide',

    // Cough & Cold
    'Cough Syrup', 'Ambroxol', 'Salbutamol', 'Ventolin', 'Pseudoephedrine',

    // Vitamins & Supplements
    'Vitamin C', 'Vitamin D', 'Calcium', 'Iron', 'Multivitamin', 'Folic Acid',

    // Diabetes
    'Metformin', 'Glibenclamide', 'Insulin',

    // Blood Pressure
    'Amlodipine', 'Enalapril', 'Losartan', 'Atenolol',

    // Others
    'Prednisolone', 'Dexamethasone', 'Salbutamol', 'Montair'
];

const getMedicineAutocomplete = (req, res) => {
    const { query } = req.query;

    if (!query || query.length < 2) {
        return res.json([]);
    }

    const searchTerm = query.toLowerCase();
    const suggestions = commonMedicines
        .filter(med => med.toLowerCase().includes(searchTerm))
        .slice(0, 8) // Limit to 8 suggestions
        .sort((a, b) => {
            // Prioritize matches at the start of the word
            const aStarts = a.toLowerCase().startsWith(searchTerm);
            const bStarts = b.toLowerCase().startsWith(searchTerm);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return a.localeCompare(b);
        });

    res.json(suggestions);
};

module.exports = {
    getMedicineAutocomplete
};
