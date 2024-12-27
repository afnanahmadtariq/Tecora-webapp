const express = require('express');
const { checkUser, login, register, userDetails, update, myworks } = require('../controllers/userController');
const authEmail = require('../middleware/authEmail');
const authJWT = require('../middleware/authJWT');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email} = req.body;
    switch (await checkUser(username, email)) {
        case "found both":
            return res.status(409).json({ error: "Username and email are already taken" });
        case "found user":
            return res.status(409).json({ error: "Username is already taken" });
        case "found email":
            return res.status(409).json({ error: "Email is already taken" });
    }
    authEmail(req, res, register);
});

router.post('/login', async (req, res) => {
    login(req, res);
});

router.get('/', async (req, res) => {
    authJWT(req, res, userDetails);
});

router.post('/update', async (req, res) => {
    authJWT(req, res, update);
});

router.get('/myworks', async (req, res) => {
    authJWT(req, res, myworks);
});

module.exports = router;


// app.get('/protected', (req, res) => {
//     const token = req.headers['authorization']?.split(' ')[1];  // Get token from 'Authorization' header
  
//     if (!token) {
//       return res.status(401).send('Access Denied');
//     }
  
//     try {
//       // Verify the token, only accept 'HS256' algorithm
//       const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
//       res.json({ message: 'This is protected data', user: decoded });
//     } catch (err) {
//       res.status(401).send('Invalid or expired token');
//     }
//   });
  