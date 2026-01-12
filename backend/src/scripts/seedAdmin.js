const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        const adminEmail = 'admin@nmra.gov.lk';
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            admin = new User({
                name: 'System Admin',
                email: adminEmail,
                role: 'admin',
                clerkId: 'demo_admin_id_12345', // Dummy ID for demo
                isBanned: false
            });
            await admin.save();
            console.log('✅ Admin user created successfully.');
        } else {
            console.log('⚠️ Admin user already exists.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedAdmin();
