const express = require('express');
const router = express.Router();
const {
    submitReport,
    getReports,
    addMessage,
    updateStatus
} = require('../controllers/reportController');

router.post('/submit', submitReport);
router.get('/all', getReports); // ?email=...&role=...
router.post('/:id/message', addMessage);
router.put('/:id/status', updateStatus);

module.exports = router;
