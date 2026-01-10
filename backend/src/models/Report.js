const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['USER', 'ADMIN'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    nic: { type: String, required: true },
    pharmacyName: { type: String, required: true },
    location: { type: String, required: true },
    province: { type: String }, // NEW
    district: { type: String }, // NEW
    medicineName: { type: String, required: true },
    pricePaid: { type: String, required: true },
    receiptImage: { type: String }, // Base64 string
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'Reviewing', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
