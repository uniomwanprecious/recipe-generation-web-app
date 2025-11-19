const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

// Database connection pool is imported here, though its connection test runs automatically
const pool = require('./db/connection'); 

// Import Routes
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable CORS for frontend communication (allows requests from http://localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Route Mapping ---
// Map imported routes to their base paths
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);


// --- Basic Root Route ---
app.get('/', (req, res) => {
    res.send('Budget-Chef Backend API is Running!');
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});
