const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user");
const feedRoutes = require("./routes/feed");
const createRoutes = require("./routes/create");
const postsRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaced body-parser with express.json()
app.use(morgan("dev")); // Add this line for logging

// Routes
app.use("/api/user", userRoutes); 
app.use("/api/feed", feedRoutes); 
app.use("/api/create", createRoutes); 
app.use("/api/posts", postsRoutes); 



// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
