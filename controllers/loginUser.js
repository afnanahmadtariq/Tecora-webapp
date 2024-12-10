require("dotenv").config(); 
const { neon } = require("@neondatabase/serverless");
// const bcrypt = require('bcrypt');

// const saltRounds = 10;

// Hashing a password
// bcrypt.hash('user_password', saltRounds, (err, hashedPassword) => {
//   if (err) {
//     console.log('Error hashing password:', err);
//     return;
//   }

//   console.log('Hashed Password:', hashedPassword);

//   // Now you can store `hashedPassword` in your database

//   // To compare password later (e.g., during login)
//   bcrypt.compare('user_password', hashedPassword, (err, result) => {
//     if (err) {
//       console.log('Error comparing passwords:', err);
//       return;
//     }
//     console.log('Password match result:', result); // true or false
//   });
// });

const sql = neon(process.env.DATABASE_URL);

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Query to find user by email
      const result = await sql`
        SELECT "user_id", "username", "email", "password", "profile_pic"
        FROM "User"
        WHERE "email" = ${email};
      `;
  
      if (result.length === 0) {
        // No user found with that email
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      const user = result[0];
  
      // Compare the provided password with the stored password
      // Assuming you use bcrypt or another hashing library for password comparison
    //   const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = password ==  user.password;
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
  
      // Password is correct, respond with user data
      res.status(200).json({
        message: "Logged in successfully",
        profilepic: "https://res.cloudinary.com/dz1sjecr6/image/upload/"+ user.profile_pic,
        user_id: user.user_id,
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      console.error("Error logging in user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
