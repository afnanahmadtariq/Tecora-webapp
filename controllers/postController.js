require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.createPost = async (req, res) => {
  const { user_id, title, content, tech_stack } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const result = await sql`
      INSERT INTO main."Post" ("user id", "title", "description")
      VALUES ( ${user_id}, ${title}, ${content})
      RETURNING "id";
    `;
    // await sql`
    //   INSERT INTO main."
    // `;
    // Get Tech stack id from tech stack table and enter in post tech stack table
    res.status(201).json({
      message: "Post created successfully",
      post_id: result[0],
    });
  } catch (err) {
    console.error("Error inserting post data:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};


exports.feedPosts = async (req, res) => {
  try {
    const result = await sql`
    SELECT "profile pic", "username", "title", "description", "date of posting", "project id", "community id", "type"
    FROM main."Post"
    LEFT JOIN main."User" ON "Post"."user id" = "User"."id";
  `;
    console.log(result); 
    res.status(201).json({
      message: "Feed of Posts",
      feed: result,
    });
  } catch (err) {
    console.error("Error getting posts feed:", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}