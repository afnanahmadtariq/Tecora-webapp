const jwt = require('jsonwebtoken');

const authJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authJWT;






const jwt = require('jsonwebtoken');
const secretKey = 'your-very-secure-secret';  // Use a secure key

// Sign a token
const token = jwt.sign({ userId: 123 }, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
console.log(token);




const jwt = require('jsonwebtoken');
// const secretKey = 'your-very-secure-secret';  // Use the same secret as above

try {
  const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
  console.log(decoded);
} catch (err) {
  console.error('Invalid token:', err);
}



// const fs = require('fs');
// const privateKey = fs.readFileSync('private.key');
// const publicKey = fs.readFileSync('public.key');

// // Sign with private key (RSA)
// const token = jwt.sign({ userId: 123 }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });

// // Verify with public key (RSA)
// try {
//   const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
//   console.log(decoded);
// } catch (err) {
//   console.error('Invalid token:', err);
// }



// const token = jwt.sign({ userId: 123 }, secretKey, { expiresIn: '1h' });
