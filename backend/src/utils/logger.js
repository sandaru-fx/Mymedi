const AuditLog = require('../models/AuditLog');

/**
 * Logs a system action to the database.
 * @param {string} action - The type of action (e.g., 'UPDATE_STATUS')
 * @param {string} adminEmail - Email of the admin performing the action
 * @param {string} details - Human readable details
 * @param {string} entityId - Optional ID of the affect entity
 * @param {string} ip - Optional IP address
 */
const logAction = async (action, adminEmail, details, entityId = null, ip = null) => {
    try {
        await AuditLog.create({
            action,
            adminEmail,
            details,
            entityId,
            ipAddress: ip
        });
    } catch (error) {
        console.error("Audit Log Failure:", error);
        // Don't crash the main flow if logging fails
    }
};

module.exports = { logAction };
