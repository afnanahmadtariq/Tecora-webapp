// Import required modules
const express = require('express');
const app = express();

// Set up a port (Azure will provide process.env.PORT)
const port = process.env.PORT || 3000;

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});