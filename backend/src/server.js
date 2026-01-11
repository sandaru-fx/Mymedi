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
// MongoDB Connection with Retry
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4 // Use IPv4 to avoid ENOTFOUND on some networks
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.log(`MongoDB Connection Error: ${err.message}`);
        if (retries > 0) {
            console.log(`Retrying connection in 5 seconds... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error('Failed to connect to MongoDB after multiple attempts.');
        }
    }
};

connectDB();

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
const contactRoutes = require('./routes/contactRoutes');

app.use('/api', medicalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/report', reportRoutes); // Legacy support if needed? No, standardizing to plural
app.use('/api/reports', reportRoutes);  // Corrected path
app.use('/api/contact', contactRoutes);
app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Network access via: http://localhost:${PORT}`);
});
