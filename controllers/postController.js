require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.createPost = async (req, res) => {
  const { userId, title, content, tech_stack } = req.body;

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const result = await sql`
      INSERT INTO "Post" ("user id", "title", "description")
      VALUES ( ${userId}, ${title}, ${content})
      RETURNING "id";
    `;
    // await sql`
    //   INSERT INTO "
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
    SELECT "profile pic", "username", "Post"."id", "title", "description", "date of posting", "project id", "community id", "type"
    FROM "Post"
    LEFT JOIN "User" ON "Post"."user id" = "User"."id";
  `;
    console.log(result); 
    res.status(200).json({
      message: "Feed of Posts",
      feed: result,
    });
  } catch (err) {
    console.error("Error getting posts feed:", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}

exports.getPost = async (id, req, res) => {
  try {
    const result = await sql`
    SELECT "profile pic", "username", "Post"."id", "title", "description", "date of posting", "project id", "community id", "type"
    FROM "Post"
    LEFT JOIN "User" ON "Post"."user id" = "User"."id"
    WHERE "Post"."id" = ${id};
  `;
    console.log(result); 
    res.status(200).json({
      message: "Feed of Posts",
      feed: result,
    });
  } catch (err) {
    console.error("Error getting posts feed:", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}

exports.getMyPost = async (req, res) => {
  console.log("user id ", req.userId);
  try {
    const result = await sql`
    SELECT "profile pic", "username", "Post"."id", "title", "description", "date of posting", "project id", "community id", "type"
    FROM "Post"
    LEFT JOIN "User" ON "Post"."user id" = "User"."id"
    WHERE "Post"."user id" = ${req.userId};
  `;
    console.log(result); 
    res.status(200).json({
      message: "Feed of Posts",
      myposts: result,
    });
  } catch (err) {
    console.error("Error getting posts :", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}