import Head from 'next/head';
import RecipeCard from '@/components/RecipeCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Saved() {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NOTE: Hardcoded User ID for MVP testing
    const MOCK_USER_ID = 1; 

    // --- Data Fetching (GET /api/recipes/saved/:userId) ---
    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                // Hits the backend route to fetch saved recipe summaries
                const response = await axios.get(`http://localhost:5000/api/recipes/saved/${MOCK_USER_ID}`);
                setSavedRecipes(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching saved recipes:", err);
                setError("Failed to load saved recipes. Ensure the backend is running and the database is configured.");
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRecipes();
    }, []);

    // --- Loading and Error States ---
    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your saved recipes...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
    }
    
    // --- Render Content ---
     return (
        <div>
            {/* ... Navigation Header is here ... */}

            <main className="main-content">
                <div className="container"> 
                    <h1 className="title-h1 text-center">Your Saved Recipes</h1>
                    
                    {/* The list wrapper and item structure must use global classes */}
                    {savedRecipes.length === 0 ? (
                        <div className="empty-state">
                            <p className="empty-text">You haven't saved any recipes yet.</p>
                            <Link href="/" className="empty-link-text link">
                                Head to the Pantry Input page to find some!
                            </Link>
                        </div>
                    ) : (
                        <div className="recipe-results-grid"> {/* Apply grid styles here */}
                            <h2 className="title-h2">Saved Items ({savedRecipes.length})</h2>
                            <div className="grid"> {/* Apply grid styles here */}
                                {savedRecipes.map((recipe) => (
                                    // Make sure RecipeCard uses the .recipe-card class internally
                                    <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}