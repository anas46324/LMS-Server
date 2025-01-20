const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Store securely in env variables

function generateToken(user) {
    const payload = { id: user._id, email: user.email };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
    
}

function verifyToken(token) {
    return jwt.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };