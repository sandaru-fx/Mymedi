const User = require('../models/User');

// Sync User (Create or Update from Frontend/Clerk)
const syncUser = async (req, res) => {
    try {
        const { clerkId, email, name } = req.body;

        let user = await User.findOne({ clerkId });

        if (user) {
            // Update existing user
            user.email = email;
            user.name = name || user.name;
            await user.save();
        } else {
            // Create new user
            user = await User.create({ clerkId, email, name });
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

module.exports = { syncUser, getAllUsers, toggleBan };
