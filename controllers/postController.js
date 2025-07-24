require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const cloudinary = require('cloudinary').v2;
cloudinary.config({ secure: true });

exports.createPost = async (req, res) => {
  const { type, title, content, media, options } = req.body;

  // Validation by type
  if (!type || !title) {
    return res.status(400).json({ message: 'Type and title are required.' });
  }
  if (type === 'post' && (!content && !media)) {
    return res.status(400).json({ message: 'Content or media is required for a post.' });
  }
  if (type === 'question' && !content) {
    return res.status(400).json({ message: 'Content is required for a question.' });
  }
  if (type === 'poll' && (!options || !Array.isArray(options) || options.length < 2)) {
    return res.status(400).json({ message: 'Options (at least 2) are required for a poll.' });
  }

  let mediaPublicId = null;
  let mediaUrl = null;
  try {
    // If media is provided, upload to Cloudinary (media should be a file path or base64 string)
    if (media) {
      const uploadResult = await cloudinary.uploader.upload(media, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      mediaPublicId = uploadResult.public_id;
      mediaUrl = cloudinary.url(mediaPublicId);
    }

    // Insert into Post, store mediaPublicId in description if content is not present, or append to content
    let description = content || '';
    if (mediaPublicId) {
      // You can choose to store the public_id or the URL; here, we append the public_id as JSON
      description = JSON.stringify({ content: description, media: mediaPublicId });
    }

    const postResult = await sql`
      INSERT INTO "Post" ("user id", "title", "description", "type")
      VALUES (${req.userId}, ${title}, ${description}, ${type})
      RETURNING "id";
    `;
    const postId = postResult[0]?.id;
    if (!postId) throw new Error('Post creation failed.');

    // Handle type-specific logic
    if (type === 'question') {
      await sql`
        INSERT INTO "Question" ("post id") VALUES (${postId});
      `;
    } else if (type === 'poll') {
      for (const option of options) {
        await sql`
          INSERT INTO "Poll" ("post id", "option") VALUES (${postId}, ${option});
        `;
      }
    }

    res.status(201).json({
      message: "Post created successfully",
      post_id: postId,
      media: mediaPublicId ? { public_id: mediaPublicId, url: mediaUrl } : undefined,
    });
  } catch (err) {
    console.error("Error inserting post data:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

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