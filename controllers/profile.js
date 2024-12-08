require("dotenv").config(); 
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

exports.createUser = async (req, res) => {
  const { username, email, password, bio, profile_pic, expertise, social_links } = req.body;

  try {
    const result = await sql`
      INSERT INTO "User" ("username", "email", "password", "bio", "profile_pic", "expertise", "social_links")
      VALUES (${username}, ${email}, ${password}, ${bio}, ${profile_pic}, ${expertise}, ${social_links})
      RETURNING "user_id";
    `;
    res.status(201).json({
      message: "User created successfully",
      user_id: result[0].user_id,
    });
  } catch (err) {
    console.error("Error inserting user data:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};
