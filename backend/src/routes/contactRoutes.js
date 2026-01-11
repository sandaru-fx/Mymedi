const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to submit message
router.post('/', contactController.createMessage);

// Admin routes (should be protected in a real app, adding placeholder for now)
router.get('/', contactController.getAllMessages);
router.patch('/:id/status', contactController.updateMessageStatus);

module.exports = router;
