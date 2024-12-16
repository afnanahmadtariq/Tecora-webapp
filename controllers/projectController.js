require("dotenv").config(); 
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

exports.createProject = async (req, res) => {
  const { user_id, name, content, tech_stack } = req.body;

  // Validation
  if (!name) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const result = await sql`
      INSERT INTO main."Project" ("user id", "name", "description")
      VALUES ( ${user_id}, ${name}, ${content})
      RETURNING "id";
    `;
    // await sql`
    //   INSERT INTO main."
    // `;
    // Get Tech stack id from tech stack table and enter in post tech stack table
    res.status(201).json({
      message: "Project created successfully",
      project_id: result[0],
    });
  } catch (err) {
    console.error("Error inserting post data:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};


exports.feedProjects = async (req, res) => {
  try {
    const result = await sql`
    SELECT "profile pic", "username", "name", "description", "date of creation", "community id", "progress"
    FROM main."Project"
    LEFT JOIN main."User" ON "Project"."user id" = "User"."id";
  `;
    console.log(result); 
    res.status(201).json({
      message: "Feed of Projects",
      feed: result,
    });
  } catch (err) {
    console.error("Error getting posts feed:", err);
    res.status(500).json({ error: "Failed to get feed posts" });
  }
}