// const jwt = require('jsonwebtoken');
// const { secretKey } = require('../utils/jwtHelper');

// function authenticateToken(req, res, next) {
//     const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
//     if (!token) {
//         return res.status(401).json({ message: 'Access Denied' });
//     }

//     try {
//         const verified = jwt.verify(token, secretKey);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Invalid Token' });
//     }
// }

// module.exports = authenticateToken();
