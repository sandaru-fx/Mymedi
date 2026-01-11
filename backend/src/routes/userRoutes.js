const express = require('express');
const router = express.Router();
const { syncUser, getAllUsers, toggleBan, getUserProfile, updateUserProfile, getSavedMedicines, toggleSavedMedicine } = require('../controllers/userController');
const { requireAuth } = require('@clerk/express');
const { requireAdmin } = require('../middleware/authMiddleware');

// Sync user from Clerk (Called by frontend on login)
router.post('/sync', syncUser);

// User Profile Routes - Protected
router.get('/profile', requireAuth(), getUserProfile);
router.patch('/profile', requireAuth(), updateUserProfile);
router.get('/saved', requireAuth(), getSavedMedicines);
router.post('/saved', requireAuth(), toggleSavedMedicine);

// Admin Routes - PROTECTED
router.use(requireAdmin);
router.get('/all', getAllUsers);
router.patch('/:id/ban', toggleBan);

module.exports = router;
