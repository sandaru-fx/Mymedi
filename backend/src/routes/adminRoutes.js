const express = require('express');
const router = express.Router();
const {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine
} = require('../controllers/adminController');

// In a real app, you would add middleware here to verify if user is actually an admin
// For this demo, we assume the frontend sends requests only if logged in as admin

router.get('/all-medicines', getAllMedicines);
router.post('/add-medicine', addMedicine);
router.put('/update-medicine/:id', updateMedicine);
router.delete('/delete-medicine/:id', deleteMedicine);

module.exports = router;
