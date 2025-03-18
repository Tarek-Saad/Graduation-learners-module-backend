const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

// Function to generate a JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email
    };

    // Sign the token with the payload and secret key, and set an expiration time
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Function to verify a JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }

}

module.exports = { generateToken, verifyToken };