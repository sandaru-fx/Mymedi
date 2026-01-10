const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { clerkMiddleware } = require('@clerk/express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.GEMINI_API_KEY) {
    console.error('CRITICAL: GEMINI_API_KEY is not defined in .env file!');
} else {
    console.log('AI Services: GEMINI_API_KEY detected.');
}

// Update this part for MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.use(cors());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(clerkMiddleware());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Import Routes
const medicalRoutes = require('./routes/medicalRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api', medicalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Network access via: http://localhost:${PORT}`);
});
