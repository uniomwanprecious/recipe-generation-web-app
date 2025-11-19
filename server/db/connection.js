const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env

// Configuration for the MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'budget_chef_api', // Use the user created in the SQL schema
    password: process.env.DB_PASSWORD || '4vR2kZ9sP5jYx7mT0nC1hF3lW6qB8uD', // Use the password from the SQL schema
    database: process.env.DB_NAME || 'budget_chef_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection when the module is loaded
pool.getConnection()
    .then(connection => {
        console.log("MySQL Pool Connected Successfully!");
        connection.release();
    })
    .catch(err => {
        console.error("Failed to connect to MySQL Pool:", err.message);
        // Exit the application if the database connection fails
        process.exit(1); 
    });

// EXPORT the pool so other files (like recipeRoutes) can run queries
module.exports = pool;