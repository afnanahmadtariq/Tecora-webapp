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
    const { topic } = req.query; // Optional topic filter

    const result = await sql`
      SELECT "profile pic", "username", "designation", "Post"."id", "title", "description", "Post"."date of posting", "project id", "community id", "type", "upvotes", "downvotes", COUNT("Reply"."id") AS "replies"
      FROM "Post"
      LEFT JOIN "User" ON "Post"."user id" = "User"."id"
      LEFT JOIN "Post Aura" ON "Post Aura"."post id" = "Post"."id"
      LEFT JOIN "Reply" ON "Reply"."post id" = "Post"."id"
      GROUP BY "Post"."id", "User"."id", "Post Aura"."post id";
    `;

    // Transform the result to match expected API contract
    let feed = result.map(post => {
      // Try to extract tags from description if it's JSON
      let tags = [];
      let description = post.description || '';
      try {
        const parsed = JSON.parse(description);
        if (parsed.tags) {
          tags = Array.isArray(parsed.tags) ? parsed.tags : parsed.tags.split(',').map(t => t.trim());
        }
      } catch (e) {
        // Not JSON, use type as a tag fallback
        if (post.type) {
          tags = [post.type];
        }
      }

      // Format date to "Mon DD, YYYY" format
      const dateObj = new Date(post['date of posting']);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return {
        id: post.id,
        title: post.title,
        username: post.username || 'Anonymous',
        designation: post.designation || '',
        profilePic: post['profile pic'] || '',
        date: formattedDate,
        tags: tags,
        replies: parseInt(post.replies) || 0
      };
    });

    // Filter by topic if provided
    if (topic) {
      feed = feed.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      );
    }

    res.status(200).json({
      feed: feed,
    });
  } catch (err) {
    console.error("Error getting posts feed:", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}

exports.getPost = async (req, res) => {
  // Get ID from headers or params for backward compatibility
  const id = req.headers.id || req.params?.id;

  if (!id) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const result = await sql`
      SELECT "profile pic", "username", "designation", "Post"."id", "title", "description", "date of posting", "project id", "community id", "type"
      FROM "Post"
      LEFT JOIN "User" ON "Post"."user id" = "User"."id"
      WHERE "Post"."id" = ${id};
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const postData = result[0];

    // Extract media and content from description if JSON
    let description = postData.description || '';
    let media = null;
    let tags = '';

    try {
      const parsed = JSON.parse(postData.description);
      description = parsed.content || '';
      if (parsed.media) {
        // Build Cloudinary URL from public_id
        media = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'dz1sjecr6'}/image/upload/${parsed.media}`;
      }
      if (parsed.tags) {
        tags = Array.isArray(parsed.tags) ? parsed.tags.join(', ') : parsed.tags;
      }
    } catch (e) {
      // Description is plain text, not JSON
    }

    // If no tags extracted, use type as fallback
    if (!tags && postData.type) {
      tags = postData.type;
    }

    const post = {
      id: postData.id,
      title: postData.title,
      description: description,
      date: postData['date of posting'],
      tags: tags,
      media: media,
      username: postData.username || 'Anonymous',
      designation: postData.designation || '',
      profilePic: postData['profile pic'] || '',
      type: postData.type
    };

    res.status(200).json({
      post: post,
    });
  } catch (err) {
    console.error("Error getting post:", err);
    res.status(500).json({ error: "Failed to get post" });
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

  if (!id) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    const result = await sql`
      SELECT "Reply"."id", "Reply"."text", "Reply"."date of reply", 
             "User"."username", "User"."profile pic"
      FROM "Reply"
      LEFT JOIN "User" ON "Reply"."user id" = "User"."id"
      WHERE "Reply"."post id" = ${id}
      ORDER BY "Reply"."date of reply" DESC;
    `;

    // Transform to expected format
    const replies = result.map(reply => ({
      id: reply.id,
      username: reply.username || 'Anonymous',
      text: reply.text || '',
      profilePic: reply['profile pic'] || '',
      date: reply['date of reply'],
      upvotes: 0,  // Default values since not in schema
      downvotes: 0
    }));

    res.status(200).json({
      replies: replies,
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
      success: true,
      message: "Reply created successfully",
      reply_id: result[0].id,
    });
  } catch (err) {
    console.error("Error inserting post data:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};