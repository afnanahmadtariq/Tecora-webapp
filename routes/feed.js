const express = require('express');
const router = express.Router();
const { feedPosts } = require("../controllers/postController");
const { feedProjects } = require('../controllers/projectController');

router.get('/posts', feedPosts);

router.get('/projects', feedProjects);

router.get('/experts', async (req, res) => {

});

// Topics endpoint - returns trendy and specialized topics
// These can be moved to database later without schema changes
router.get('/topics', async (req, res) => {
    try {
        const topics = {
            trendy: [
                "AI",
                "React",
                "Machine Learning",
                "Web3",
                "TypeScript",
                "Next.js",
                "Python",
                "DevOps"
            ],
            specialized: [
                "WordPress",
                "Design",
                "UI/UX",
                "Mobile Development",
                "Backend",
                "Database",
                "Security",
                "Cloud"
            ]
        };

        res.status(200).json(topics);
    } catch (err) {
        console.error("Error getting topics:", err);
        res.status(500).json({ error: "Failed to get topics" });
    }
});

module.exports = router;