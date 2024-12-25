require("dotenv").config();
const jwt = require('jsonwebtoken');
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcrypt");

const sql = neon(process.env.DATABASE_URL);
const secretKey = process.env.JWT_SECRET_KEY;

checkUser = async(username, email) => {
  try {
    foundUser = true;
    const result = await sql`
      SELECT "id"
      FROM "User"
      WHERE "email" = ${email};
    `;
    if (result.length === 0) {
      foundUser = false;
    }
    foundEmail = true;
    const res = await sql`
      SELECT "id"
      FROM "User"
      WHERE "username" = ${username};
    `;
    if (res.length === 0) {
      foundEmail = false;
    }
    if (foundEmail && foundEmail) {
      return "found both";
    }
    else if (foundUser) {
      return "found user";
    }
    else if (foundEmail) {
      return "found email";
    }
    else {
      return "nothing";
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function createUser(username, email, passwordHash, res) {
  try {
    const result = await sql`
      INSERT INTO "User" ("username", "email")
      VALUES ( ${username}, ${email})
      RETURNING "id";
    `;
    const userId = result[0].id
    await sql`
      INSERT INTO auth."Passwords" ("user id", "password hash")
      VALUES ( ${userId}, ${passwordHash});
    `;
    res.status(201).json({
      message: "User created successfully"
    });
  } catch (err) {
    console.error("Error inserting user data:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
}

register = async(req, res) => {
  const { username, email, password} = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    await createUser(username, email, hashedPassword, res);
    // res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

login = async(req, res) => {
  const { email, password } = req.body;
  
    try {
      // Query to find user by email
      const result = await sql`
        SELECT "id", "username", "email"
        FROM "User"
        WHERE "email" = ${email};
      `;
  
      if (result.length === 0) {
        // No user found with that email
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const user = result[0];
      const passwordHash = await sql`
        SELECT "password hash"
        FROM auth."Passwords"
        WHERE "user id" = ${user.id};
      `;
  
      // Compare the provided password with the stored password
      const isPasswordValid = await bcrypt.compare(password, passwordHash[0]['password hash']);
  
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      // Payload data for JWT
      const payload = {
        userId: user.id,
        username: user.username,
      };

      const token = jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
      
      // Password is correct, respond with user data
      res.status(200).json({
        message: "Logged in successfully",
        // profilepic: "https://res.cloudinary.com/dz1sjecr6/image/upload/"+ user.profile_pic,
        // user_id: user.user_id,
        // username: user.username,
        // email: user.email,
        token: token, // Send the token as part of the response
      });
    } catch (err) {
      console.error("Error logging in user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
}

userDetails = async (req, res) => {
  const userId = req.userId;  
  console.log("user id", userId);
  const result = await sql`
    SELECT *
    FROM "User"
    WHERE "id" = ${userId};
  `;
  if (result[0]) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'User not found' });
  }

}
module.exports = { checkUser, register, login, userDetails };