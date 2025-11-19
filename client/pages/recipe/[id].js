import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';

// Mock User ID for demonstration until real login is implemented
const MOCK_USER_ID = 1;

export default function RecipeDetail() {
    const router = useRouter();
    const { id } = router.query; // Gets the ID from the URL path
    
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // --- MOCK DATA Definition (For use until real API is built) ---
    const MOCK_RECIPE_DETAIL = {
        id: 101,
        title: "Quick Pasta with Pesto & Cherry Tomatoes",
        total_prep_time: "15 min",
        total_estimated_cost: 3.85,
        ingredients: [
            { name: "Spaghetti", is_pantry: true, quantity: "300g" },
            { name: "Pesto Sauce", is_pantry: false, quantity: "100g (Missing)" },
            { name: "Cherry Tomatoes", is_pantry: true, quantity: "1 cup" },
            { name: "Parmesan Cheese", is_pantry: false, quantity: "2 tbsp (Missing)" },
            { name: "Garlic", is_pantry: true, quantity: "2 cloves" },
        ],
        instructions: [
            "Boil water in a large pot and cook spaghetti according to package directions.",
            "While pasta cooks, halve the cherry tomatoes and mince the garlic.",
            "Drain the pasta, reserving 1/4 cup of the pasta water.",
            "Return the pasta to the pot. Stir in the pesto, tomatoes, and garlic.",
            "Add a little reserved pasta water until the sauce reaches your desired consistency. Serve immediately, topped with Parmesan."
        ],
    };

    // --- Data Fetching Effect ---
    useEffect(() => {
        if (id) {
            fetchRecipeDetails(id);
        }
    }, [id]);

    const fetchRecipeDetails = async (recipeId) => {
        setIsLoading(true);
        setErrorMessage('');
        
        try {
            // Note: Currently hits the MOCK logic in the backend route
            const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}`);
            // Set the mock data regardless of ID for presentation
            setRecipe(MOCK_RECIPE_DETAIL); 
        } catch (error) {
            console.error("Failed to fetch recipe details:", error);
            setErrorMessage("Could not load recipe details. Check server connection.");
            // If API fails, still show mock data for styling verification
            setRecipe(MOCK_RECIPE_DETAIL); 
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Save Handler ---
    const handleSaveRecipe = async () => {
        setSaveMessage('Saving...');
        setErrorMessage('');
        
        try {
            // Note: Currently hits the MOCK logic in the backend route
            await axios.post('http://localhost:5000/api/recipes/save', {
                recipeId: id,
                userId: MOCK_USER_ID, // Use mock user ID
                recipeTitle: recipe.title 
            });
            setSaveMessage('Recipe saved successfully!');
        } catch (error) {
            setErrorMessage('Failed to save recipe. Try logging in first.');
            setSaveMessage('');
        }
    };
    
    // --- Render Logic ---

    if (isLoading) {
        return (
            <div className="main-content">
                <div className="loading-message">Loading recipe details...</div>
            </div>
        );
    }
    
    if (errorMessage && !recipe) {
         return (
            <div className="main-content">
                <div className="error-message">{errorMessage}</div>
            </div>
        );
    }
    
    if (!recipe) {
        return (
            <div className="main-content">
                <div className="not-found">Recipe not found.</div>
            </div>
        );
    }

    return (
        <div>
            <Head>
                <title>{recipe.title} - Budget-Chef</title>
            </Head>
            
            {/* START UNIVERSAL NAVIGATION BLOCK */}
            <header className="nav-header">
                <div className="container nav-container">
                    <Link href="/" className="nav-link">
                        🏠 Pantry Input
                    </Link>
                    <Link href="/saved" className="nav-link">
                        ⭐ Saved Recipes
                    </Link>
                    <Link href="/profile" className="nav-link">
                        👤 Profile/Login
                    </Link>
                </div>
            </header>
            {/* END UNIVERSAL NAVIGATION BLOCK */}

            <main className="main-content">
                <div className="container">
                    
                    {/* Main detail content area with styling class */}
                    <div className="recipe-detail-container"> 
                        
                        <div className="detail-header">
                            <h1 className="detail-title">{recipe.title}</h1>
                            <p className="detail-time">Prep Time: {recipe.total_prep_time}</p>
                        </div>
                        
                        <div className="detail-section">
                            <h3 className="title-h3">Estimated Cost</h3>
                            <p className="detail-cost">${recipe.total_estimated_cost.toFixed(2)}</p>
                        </div>
                        
                        {/* Ingredients Section */}
                        <div className="detail-section">
                            <h3 className="title-h3">Ingredients</h3>
                            <ul className="ingredient-list">
                                {recipe.ingredients.map((item, index) => (
                                    <li key={index} className={item.is_pantry ? "ingredient-pantry" : "ingredient-missing"}>
                                        {item.quantity} of {item.name}
                                        {!item.is_pantry && (
                                            <span className="missing-tag">(Missing)</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Instructions Section */}
                        <div className="detail-section">
                            <h3 className="title-h3">Instructions</h3>
                            <ol className="instruction-list">
                                {recipe.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>

                        {/* Save Button and Messages */}
                        {saveMessage && <div className="loading-message" style={{marginBottom: '10px'}}>{saveMessage}</div>}
                        {errorMessage && <div className="error-message" style={{marginBottom: '10px'}}>{errorMessage}</div>}
                        
                        <button onClick={handleSaveRecipe} className="button-primary">
                            {saveMessage.includes('saved') ? 'Recipe Already Saved' : 'Save Recipe'}
                        </button>
                        
                    </div>
                    
                </div>
            </main>
        </div>
    );
}