require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.createPost = async (req, res) => {
  const { title, content, tech_stack } = req.body

  // Validation
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const result = await sql`
      INSERT INTO "Post" ("user id", "title", "description")
      VALUES ( ${req.userId}, ${title}, ${content})
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
      SELECT "profile pic", "username", "Post"."id", "title", "description", "Post"."date of posting", "project id", "community id", "type", "upvotes", "downvotes", COUNT("Reply"."id") AS "replies"
      FROM "Post"
      LEFT JOIN "User" ON "Post"."user id" = "User"."id"
      LEFT JOIN "Post Aura" ON "Post Aura"."post id" = "Post"."id"
      LEFT JOIN "Reply" ON "Reply"."post id" = "Post"."id"
      GROUP BY "Post"."id", "User"."id", "Post Aura"."post id";;
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

exports.getUserPost = async (req, res) => {
  try {
    const result = await sql`
    SELECT "profile pic", "username", "Post"."id", "title", "description", "date of posting", "project id", "community id", "type"
    FROM "Post"
    LEFT JOIN "User" ON "Post"."user id" = "User"."id"
    WHERE "Post"."user id" = ${req.userId};
  `;
    // console.log(result); 
    // res.status(200).json({
    //   message: "Feed of Posts",
    //   Userposts: result,
    // });
    return result;
  } catch (err) {
    console.error("Error getting posts :", err);
    // res.status(500).json({ error: "Failed to get feed posts" });
  }
}

exports.getReplies = async (req, res) => {
  const { id } = req.headers;
  console.log(id);
  try {
    const result = await sql`
    SELECT *
    FROM "Reply"
    WHERE "Reply"."post id" = ${id};
  `;
    console.log(result); 
    res.status(200).json({
      message: "Replies of Post",
      replies: result,
    });
  } catch (err) {
    console.error("Error getting replies:", err);
    res.status(500).json({ error: "Failed to get replies" });
  }
}

exports.reply = async (req, res) => {
  const { id, text } = req.body

  try {
    const result = await sql`
      INSERT INTO "Reply" ("user id", "post id", "text")
      VALUES ( ${req.userId}, ${id}, ${text})
      RETURNING "id";
    `;
    res.status(201).json({
      message: "Reply created successfully",
      post_id: result[0],
    });
  } catch (err) {
    console.error("Error inserting post data:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};