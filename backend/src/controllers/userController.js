const User = require('../models/User');

// Sync User (Create or Update from Frontend/Clerk)
const syncUser = async (req, res) => {
    try {
        const { clerkId, email, name } = req.body;

        let user = await User.findOne({ clerkId });
        const role = email === 'admin@nmra.gov.lk' ? 'admin' : 'user';

        if (user) {
            // Update existing user
            user.email = email;
            user.name = name || user.name;
            // Upgrade to admin if email matches (just in case they were synced as user before)
            if (role === 'admin') user.role = 'admin';
            await user.save();
        } else {
            // Create new user
            user = await User.create({ clerkId, email, name, role });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("User Sync Error:", error);
        res.status(500).json({ error: "Failed to sync user" });
    }
};

// GET All Users (Admin)
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const total = await User.countDocuments();
        const users = await User.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Toggle Ban Status
const toggleBan = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ error: "User not found" });

        user.isBanned = !user.isBanned;
        await user.save();

        res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, isBanned: user.isBanned });
    } catch (error) {
        res.status(500).json({ error: "Failed to update ban status" });
    }
};

// Get Current User Profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.auth;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ error: "User profile not found" });

        res.json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { phone, nic, address, name } = req.body;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update fields
        if (phone !== undefined) user.phone = phone;
        if (nic !== undefined) user.nic = nic;
        if (address !== undefined) user.address = address;
        if (name !== undefined) user.name = name; // Allow name edit

        await user.save();
        res.json(user);
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

// Get Saved Medicines
const getSavedMedicines = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findOne({ clerkId: userId }).populate('savedMedicines');

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user.savedMedicines);
    } catch (error) {
        console.error("Get Saved Meds Error:", error);
        res.status(500).json({ error: "Failed to fetch saved medicines" });
    }
};

// Toggle Saved Medicine
const toggleSavedMedicine = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { medicineId } = req.body;

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isSaved = user.savedMedicines.includes(medicineId);

        if (isSaved) {
            user.savedMedicines.pull(medicineId);
        } else {
            user.savedMedicines.addToSet(medicineId);
        }

        await user.save();
        res.json({ isSaved: !isSaved, savedMedicines: user.savedMedicines });
    } catch (error) {
        console.error("Toggle Saved Med Error:", error);
        res.status(500).json({ error: "Failed to update saved medicines" });
    }
};

module.exports = { syncUser, getAllUsers, toggleBan, getUserProfile, updateUserProfile, getSavedMedicines, toggleSavedMedicine };
