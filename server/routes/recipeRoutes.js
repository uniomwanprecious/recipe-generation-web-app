const express = require('express');
const router = express.Router();

// 1. DB CONNECTION: Imports the database connection pool
const pool = require('../db/connection'); 

// 2. AI COMPOSER: Imports the function that handles AI generation logic
const { generateRecipesFromAI } = require('../utils/Apicomposer'); 

// --- 1. Recipe Generation Logic (UPDATED to use AI Composer) ---

const generateRecipeList = async (req, res) => {
    const { ingredients, preferences } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: "No ingredients provided to generate recipes." });
    }

    try {
        // Attempt AI Generation first (as per modular design)
        const aiRecipes = await generateRecipesFromAI(ingredients, preferences);

        if (aiRecipes && aiRecipes.length > 0) {
            // If the AI successfully generates recipes (or mock data), use them
            return res.status(200).json(aiRecipes);
        }

        // --- FALLBACK (Optional: SQL Logic) ---
        // If the AI fails or returns empty, the previous SQL logic would be here 
        // to provide a reliable database lookup as a fallback.
        
        // For now, we return empty if AI generation fails/returns empty array
        res.status(200).json([]); 

    } catch (err) {
        console.error("AI/DB Recipe Generation Error:", err);
        res.status(500).json({ error: "Failed to generate recipes due to a server error." });
    }
};

// --- 2. Get Recipe Details Logic (REAL DB IMPLEMENTATION) ---

const getRecipeDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();

        // 1. Get the main recipe details
        const [recipeRows] = await connection.execute('SELECT * FROM recipes WHERE id = ?', [id]);
        
        if (recipeRows.length === 0) {
            connection.release();
            return res.status(404).json({ error: "Recipe not found." });
        }
        const recipe = recipeRows[0];

        // 2. Get the associated ingredients
        const [ingredientRows] = await connection.execute('SELECT ingredient_name, quantity FROM recipe_ingredients WHERE recipe_id = ?', [id]);
        connection.release();

        // 3. Combine and send response
        res.status(200).json({
            ...recipe,
            ingredients: ingredientRows.map(i => ({ 
                name: i.ingredient_name, 
                quantity: i.quantity,
                // is_pantry status is determined on the frontend
                is_pantry: true 
            }))
        });

    } catch (err) {
        console.error("Database Error fetching Recipe Details:", err);
        res.status(500).json({ error: "Failed to fetch recipe details." });
    }
};

// --- 3. Save Recipe Logic (REAL DB IMPLEMENTATION) ---

const saveRecipe = async (req, res) => {
    // Assuming userId is passed from the frontend after successful login
    const { recipeId, userId, recipeTitle } = req.body; 

    if (!recipeId || !userId) {
        return res.status(400).json({ error: "Missing required fields (recipeId or userId)." });
    }

    try {
        const connection = await pool.getConnection();
        
        const sql = 'INSERT INTO saved_recipes (user_id, recipe_id, recipe_title) VALUES (?, ?, ?)';
        await connection.execute(sql, [userId, recipeId, recipeTitle]);
        
        connection.release();
        res.status(201).json({ message: "Recipe saved successfully!", saved: true });

    } catch (err) {
        connection.release();
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Recipe is already saved by this user." });
        }
        console.error("Database Error saving recipe:", err);
        res.status(500).json({ error: "Failed to save recipe." });
    }
};

// --- 4. Get Saved Recipes Logic (REAL DB IMPLEMENTATION) ---

const getSavedRecipes = async (req, res) => {
    const { userId } = req.params;

    try {
        const connection = await pool.getConnection();
        
        // Select all recipes saved by the given user
        const sql = 'SELECT recipe_id, recipe_title, created_at FROM saved_recipes WHERE user_id = ? ORDER BY created_at DESC';
        const [rows] = await connection.execute(sql, [userId]);
        
        connection.release();
        
        res.status(200).json(rows);

    } catch (err) {
        console.error("Database Error fetching saved recipes:", err);
        res.status(500).json({ error: "Failed to retrieve saved recipes." });
    }
};


// --- Route Mapping ---

router.post('/generate', generateRecipeList); 
router.get('/:id', getRecipeDetails);
router.post('/save', saveRecipe);
router.get('/saved/:userId', getSavedRecipes);

module.exports = router;