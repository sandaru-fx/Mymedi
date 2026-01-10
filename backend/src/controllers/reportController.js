const Report = require('../models/Report');

// Submit a new report (User)
const submitReport = async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json(report);
    } catch (error) {
        console.error("Submit Report Error:", error);
        res.status(500).json({ error: "Failed to submit report." });
    }
};

// Get reports (Admin gets all, User gets theirs)
const getReports = async (req, res) => {
    try {
        const { email, role } = req.query;
        let query = {};

        // If not admin, filter by email
        if (role !== 'ADMIN') {
            if (!email) return res.status(400).json({ error: "User email required." });
            query = { userEmail: email };
        }

        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reports." });
    }
};

// Add a message to the chat (User or Admin)
const addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { sender, text } = req.body; // sender: 'USER' or 'ADMIN'

        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ error: "Report not found." });

        report.messages.push({ sender, text });

        // If Admin replies, maybe update status to 'Reviewing'
        if (sender === 'ADMIN' && report.status === 'Pending') {
            report.status = 'Reviewing';
        }

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message." });
    }
};

// Update Status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.json(report);
    } catch (error) {
        res.status(500).json({ error: "Failed to update status." });
    }
};

module.exports = {
    submitReport,
    getReports,
    addMessage,
    updateStatus
};
