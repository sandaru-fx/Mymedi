const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');
const autocompleteController = require('../controllers/autocompleteController');

const { requireAuth } = require('@clerk/express');

router.post('/medicine-details', requireAuth(), medicalController.getMedicineDetails);
router.post('/analyze-symptoms', requireAuth(), medicalController.analyzeSymptoms);
router.post('/emergency-instructions', requireAuth(), medicalController.getEmergencyInstructions);
router.get('/autocomplete', requireAuth(), autocompleteController.getMedicineAutocomplete);

module.exports = router;
