const express = require('express');
const router = express.Router();
const {
    getAllMedicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    bulkUploadMedicines,
    getAIAnalytics,
    getAuditLogs,
    getSystemHealth,
    analyzeReportFraud
} = require('../controllers/adminController');

const { requireAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer();

// PROTECTED ROUTES: Only accessible by Admins with valid Clerk Token
router.use(requireAdmin);

router.get('/all-medicines', getAllMedicines);
router.post('/bulk-upload', upload.single('file'), bulkUploadMedicines);
router.get('/ai-analytics', getAIAnalytics);
router.get('/audit-logs', getAuditLogs);
router.get('/health', getSystemHealth);
router.post('/analyze-fraud', analyzeReportFraud);
router.post('/add-medicine', addMedicine);
router.put('/update-medicine/:id', updateMedicine);
router.delete('/delete-medicine/:id', deleteMedicine);

module.exports = router;
