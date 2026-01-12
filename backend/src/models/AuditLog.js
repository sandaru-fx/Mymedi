const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String, // e.g., 'LOGIN', 'RESOLVE_REPORT', 'BAN_USER'
        required: true
    },
    adminEmail: {
        type: String,
        required: true
    },
    details: {
        type: String, // Description of what happened
        required: true
    },
    entityId: {
        type: String, // ID of the object affected (Report ID, User ID)
        required: false
    },
    ipAddress: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
