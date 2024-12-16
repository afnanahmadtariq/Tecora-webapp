const express = require('express');
const { register } = require('../controllers/user');
const authEmail = require('../middleware/authEmail');
const router = express.Router();
const { login } = require("../controllers/user");


// async function hashPassword(password) {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     return hashedPassword;
// }

router.post('/register', async (req, res) => {
    // const { username, email, password } = req.body;
    authEmail(req, res, register);

    // try {
    //     const hashedPassword = await hashPassword(password);
    //     await createUser(username, hashedPassword);
    //     res.status(201).json({ message: 'User created successfully' });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Server error' });
    // }
});

router.post('/login', async (req, res) => {
    // const { username, email, password } = req.body;
    login(req, res);

    // try {
    //     const hashedPassword = await hashPassword(password);
    //     await createUser(username, hashedPassword);
    //     res.status(201).json({ message: 'User created successfully' });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Server error' });
    // }
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
  