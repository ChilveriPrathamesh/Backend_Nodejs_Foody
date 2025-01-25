const Vendor = require('../models/Vender');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Get the secret key from .env
const secretKey = process.env.WhatIsYourName;

if (!secretKey) {
    console.error("JWT_SECRET is missing in .env file");
    process.exit(1); // Stop the server if no secret key
}

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.token; // Get token from headers

        if (!token) {
            return res.status(401).json({ error: "Token is required" });
        }

        // Verify the token
        const decoded = jwt.verify(token, secretKey);

        // Find the vendor in the database
        const vendor = await Vendor.findById(decoded.vendorId);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        req.vendorId = vendor._id; // Store vendor ID for further use
        next(); // Proceed to next middleware
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
