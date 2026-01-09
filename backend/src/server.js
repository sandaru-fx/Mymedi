const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MediGuide AI Backend Running');
});

// Import Routes
// const medicineRoutes = require('./routes/medicineRoutes');
// app.use('/api/medicines', medicineRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
