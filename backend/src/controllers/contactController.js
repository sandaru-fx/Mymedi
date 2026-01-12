const ContactMessage = require('../models/ContactMessage');

// Create a new contact message
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new ContactMessage({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: newMessage
        });
    } catch (error) {
        console.error('Create Message Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Get all messages (Admin only)
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

// Update message status
exports.updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated',
            data: message
        });
    } catch (error) {
        console.error('Update Message Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message',
            error: error.message
        });
    }
};

// Reply to a message
exports.replyToMessage = async (req, res) => {
    try {
        const { adminReply } = req.body;
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { adminReply, status: 'Replied' },
            { new: true }
        );
        const { logAction } = require('../utils/logger');
        await logAction('REPLY_INQUIRY', 'Admin', `Replied to inquiry: ${message.subject}`, message._id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Reply saved successfully',
            data: message
        });
    } catch (error) {
        console.error('Reply Message Error:', error);
        res.status(500).json({ success: false, message: 'Failed to save reply' });
    }
};

// Toggle block status of a message
exports.toggleBlockMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        message.isBlocked = !message.isBlocked;
        await message.save();
        const { logAction } = require('../utils/logger');
        await logAction(message.isBlocked ? 'BLOCK_INQUIRY' : 'UNBLOCK_INQUIRY', 'Admin', `${message.isBlocked ? 'Blocked' : 'Unblocked'} inquiry from: ${message.email}`, message._id);

        res.status(200).json({
            success: true,
            message: message.isBlocked ? 'Message blocked' : 'Message unblocked',
            data: message
        });
    } catch (error) {
        console.error('Block Message Error:', error);
        res.status(500).json({ success: false, message: 'Failed to toggle block status' });
    }
};
const User = require('../models/User');

// Get messages for the current user
exports.getUserMessages = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const messages = await ContactMessage.find({ email: user.email }).sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Get User Messages Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

module.exports = exports;
