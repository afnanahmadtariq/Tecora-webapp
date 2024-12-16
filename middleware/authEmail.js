const jwt = require('jsonwebtoken');

const authEmail = (req, res, next) => {
    // const {username, email, password} = req.body;
    // const token = req.header('Authorization');
    // if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // try {
    //     const decoded = jwt.verify(token, 'your_secret_key');
    //     req.user = decoded.user;
        next(req, res);
    // } catch (err) {
    //     res.status(401).json({ message: 'Invalid token' });
    // }
};

module.exports = authEmail;
