const { Pool } = require('pg');

// Configure the PostgreSQL connection
const pool = new Pool({
  user: 'your-db-username',          // Replace with your DB username
  host: 'your-db-host',              // Replace with your DB host (e.g., localhost or Neon DB URL)
  database: 'your-db-name',          // Replace with your database name
  password: 'your-db-password',      // Replace with your DB password
  port: 5432,                        // Default PostgreSQL port
});

// Export the pool object to use in queries
module.exports = pool;
