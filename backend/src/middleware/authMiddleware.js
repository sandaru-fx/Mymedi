const { requireAuth } = require('@clerk/express');
const User = require('../models/User');

// Middleware to check if user is an Admin
const requireAdmin = async (req, res, next) => {
    try {
        // 1. Check if authenticated with Clerk
        if (!req.auth || !req.auth.userId) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // 2. Check Database for Role
        const user = await User.findOne({ clerkId: req.auth.userId });

        if (!user) {
            return res.status(403).json({ error: "Forbidden: User not found in database" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Admin access required" });
        }

        // 3. Attach user to request for controllers
        req.user = user;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(500).json({ error: "Internal Server Error during Auth" });
    }
};

module.exports = { requireAdmin };
