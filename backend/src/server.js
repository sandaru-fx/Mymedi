const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { clerkMiddleware } = require('@clerk/express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Update this part for MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('MediGuide AI Backend Running');
});

// Import Routes
const medicalRoutes = require('./routes/medicalRoutes');

app.use('/api', medicalRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
