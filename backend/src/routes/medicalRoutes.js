const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');
const autocompleteController = require('../controllers/autocompleteController');

const { requireAuth } = require('@clerk/express');

router.post('/medicine-details', medicalController.getMedicineDetails);
router.post('/analyze-symptoms', medicalController.analyzeSymptoms);
router.post('/emergency-instructions', medicalController.getEmergencyInstructions);
router.get('/autocomplete', autocompleteController.getMedicineAutocomplete);

module.exports = router;
