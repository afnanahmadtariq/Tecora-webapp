require("dotenv").config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;

const authJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    console.log('Decoded JWT:', decoded);
    req.userId = decoded.userId;
    next(req, res);
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authJWT;