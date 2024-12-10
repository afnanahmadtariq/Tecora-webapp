const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/posts');
const queries = require('./controllers/myQueries');  
const projects = require('./controllers/projects'); 
const createRoutes = require('./routes/createUser');
const updateRoutes = require('./routes/updateUser');
const queriesRoutes = require('./routes/queries');
const loginRoutes = require('./routes/login');
const query1 = require("./controllers/myQueries");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Replaced body-parser with express.json()
app.use(morgan('dev')); // Add this line for logging

// Routes
app.use('/api/posts', postRoutes);

app.use('/api/create-user', createRoutes);
app.use('/api/update-user', updateRoutes);
app.use('/api/login', loginRoutes);

// Endpoint to get queries
app.use('/api/queries', queriesRoutes);

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/queries/1', (req, res) => {
  res.json(query1);
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
