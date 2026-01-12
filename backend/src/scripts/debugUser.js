const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const debugUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = await User.findOne({ email: 'admin@nmra.gov.lk' });
        if (admin) {
            console.log('Debug: Admin user FOUND:', admin.email);
            console.log('Debug: Role:', admin.role);
        } else {
            console.log('Debug: Admin user NOT FOUND.');
        }
        process.exit();
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
};

debugUser();
