const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debugging log
        const user = await User.findById(decoded.id);

        if (!user) {
            console.error('User not found for token:', decoded);
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user; // Attach user to request
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;