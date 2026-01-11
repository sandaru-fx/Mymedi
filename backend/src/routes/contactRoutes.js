const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

const { requireAdmin } = require('../middleware/authMiddleware');

const { requireAuth } = require('@clerk/express');

// Public route to submit message
router.post('/', contactController.createMessage);

// User Routes - Protected
router.get('/my', requireAuth(), contactController.getUserMessages);

// Admin routes - PROTECTED
router.use(requireAdmin);
router.get('/', contactController.getAllMessages);
router.patch('/:id/status', contactController.updateMessageStatus);
router.patch('/:id/reply', contactController.replyToMessage);
router.patch('/:id/block', contactController.toggleBlockMessage);

module.exports = router;
