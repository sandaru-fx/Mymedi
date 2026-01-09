const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');

router.post('/medicine-details', medicalController.getMedicineDetails);
router.post('/analyze-symptoms', medicalController.analyzeSymptoms);
router.post('/emergency-instructions', medicalController.getEmergencyInstructions);

module.exports = router;
