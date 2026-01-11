const express = require('express');
const router = express.Router();
const { syncUser, getAllUsers, toggleBan } = require('../controllers/userController');

// Sync user from Clerk (Called by frontend on login)
router.post('/sync', syncUser);

// Admin Routes (Should be protected in prod)
router.get('/all', getAllUsers);
router.patch('/:id/ban', toggleBan);

module.exports = router;
