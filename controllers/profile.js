require("dotenv").config(); 
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

exports.createUser = async (req, res) => {
  const { user_id, username, email, password, bio, profile_pic, expertise, social_links } = req.body;

  const query = `
    INSERT INTO "User" ("user_id", "username", "email", "password", "bio", "profile_pic", "expertise", "social_links")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING "user_id";
  `;

  const values = [user_id, username, email, password, bio, profile_pic, expertise, social_links];

  try {
    const result = await sql`
      INSERT INTO "User" ("user_id", "username", "email", "password", "bio", "profile_pic", "expertise", "social_links")
      VALUES (${user_id}, ${username}, ${email}, ${password}, ${bio}, ${profile_pic}, ${expertise}, ${social_links})
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
