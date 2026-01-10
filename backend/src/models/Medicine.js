const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    uses: {
        type: String,
        required: true
    },
    howToUse: {
        type: String,
        required: true
    },
    priceRange: {
        type: String,
        required: true
    },
    sideEffects: {
        type: [String],
        default: []
    },
    foodInteractions: {
        type: String,
        required: true
    },
    disclaimer: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
