const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: 'User'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        default: ''
    },
    nic: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    savedMedicines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
