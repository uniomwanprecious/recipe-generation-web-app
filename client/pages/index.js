import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // <-- ADDED for Navigation
import PantryInput from '../components/PantryInput'; 
import RecipeCard from '../components/RecipeCard'; 

export default function Home() {
    // 1. State for User Input
    const [pantryItems, setPantryItems] = useState([]);
    const [dietaryPreferences, setDietaryPreferences] = useState([]);
    
    // 2. State for API Results
    const [recipeResults, setRecipeResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // --- Handlers for User Input ---

    const handleAddItem = (item) => {
        if (item && !pantryItems.includes(item)) {
            setPantryItems([...pantryItems, item]);
        }
    };

    const handleRemoveItem = (itemToRemove) => {
        setPantryItems(pantryItems.filter(item => item !== itemToRemove));
    };

    const handleTogglePreference = (preference) => {
        if (dietaryPreferences.includes(preference)) {
            setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
        } else {
            setDietaryPreferences([...dietaryPreferences, preference]);
        }
    };

    // --- API Integration Handler (POST /api/recipes/generate) ---
    
    const handleGenerateRecipe = async () => {
        if (pantryItems.length === 0) {
            alert("Please add at least one ingredient to your pantry.");
            return;
        }
        
        setIsLoading(true);
        setRecipeResults([]); 

        const requestBody = {
            ingredients: pantryItems,
            preferences: dietaryPreferences
        };

        try {
            // Note: This hits the backend route which currently returns MOCK data
            const response = await axios.post(
                'http://localhost:5000/api/recipes/generate', 
                requestBody
            );

            setRecipeResults(response.data);
        } catch (error) {
            console.error("Recipe generation failed:", error);
            alert("Failed to fetch recipes. Ensure the backend server is running on port 5000 and the route is configured.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Component JSX ---

    return (
        <div>
            <Head>
                <title>Budget-Chef: What's In Your Pantry?</title>
            </Head>

            {/* START NAVIGATION BLOCK */}
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
            {/* END NAVIGATION BLOCK */}


            <main className="main-content">
                <div className="container">
                    
                    <h1 className="title-h1 text-center">
                        Pantry Input: Find Your Next Meal
                    </h1>

                    <PantryInput 
                        pantryItems={pantryItems}
                        dietaryPreferences={dietaryPreferences}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        onTogglePreference={handleTogglePreference}
                        onGenerate={handleGenerateRecipe}
                        isLoading={isLoading}
                    />

                    <p className="tip-text text-center">
                        Tip: Keep your list simple for budget-friendly results!
                    </p>

                    {/* Recipe Results Section */}
                    {isLoading && (
                        <div className="loading-message">
                            Generating recipes... 🍳
                        </div>
                    )}

                    {!isLoading && recipeResults.length > 0 && (
                        <div className="recipe-results-grid">
                            <h2 className="title-h2">
                                Suggested Recipes ({recipeResults.length})
                            </h2>
                            <div className="grid">
                                {recipeResults.map((recipe) => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}