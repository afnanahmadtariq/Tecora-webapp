require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);
  
exports.queries = async (req, res) => {

  try {
    const result = await sql`
      SELECT "query_id", "user_id", "title", "upvote", "downvote", "date", "tags", "solved" 
      FROM "Queries"
      WHERE "query_id" = 23;
    `;
    res.status(201).json({
      message: "ahhahah",
      queries: result,
    });
  } catch (err) {
    console.error("Error inserting user data:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.query1 = 
      {
          "query_id": 23,
          "user_id": 1,
          "title": "s",
          "upvote": 0,
          "downvote": 0,
          "description": "wadwa",
          "media": null,
          "date": "2024-12-08T19:00:00.000Z",
          "tags": null,
          "solved": false
      };