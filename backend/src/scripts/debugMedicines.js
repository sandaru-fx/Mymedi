const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../models/Medicine');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const debugDB = async () => {
    try {
        console.log('Debug: Connecting to MongoDB...');
        // console.log('URI:', process.env.MONGODB_URI); // Be careful with logging secrets
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Debug: Connected.');

        const count = await Medicine.countDocuments({});
        console.log(`Debug: Total Medicines in DB: ${count}`);

        if (count > 0) {
            const sample = await Medicine.findOne({});
            console.log('Debug: Sample Medicine:', sample.medicineName);
        }

        process.exit();
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
};

debugDB();
