import Head from 'next/head';
import RecipeCard from '@/components/RecipeCard'; // Using alias
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// MOCK DATA (Will be replaced by data passed via router state or API)
const MOCK_RECIPES = [
    { id: 1, title: "Quick Peanut Noodles", cost_efficiency: 0.95, missing_items: [], total_prep_time: "15 min", dietary_tags: ["Vegetarian"], nutrition_summary: { calories: 450 } },
    { id: 2, title: "Chicken and Rice Skillet", cost_efficiency: 0.70, missing_items: ["Soy Sauce"], total_prep_time: "35 min", dietary_tags: ["High Protein"], nutrition_summary: { calories: 580 } },
    { id: 3, title: "Lentil Soup", cost_efficiency: 0.40, missing_items: ["Broth", "Carrots"], total_prep_time: "50 min", dietary_tags: ["Gluten-Free"], nutrition_summary: { calories: 310 } }
];

export default function Results() {
  const router = useRouter();
  // Attempt to read data passed from the PantryInput component
  const [recipes, setRecipes] = useState(router.query.results ? JSON.parse(router.query.results) : MOCK_RECIPES);
  
  // NOTE: In a production app, you would use useEffect to re-fetch if state is empty
  if (recipes.length === 0) {
      return (
          <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">No Ingredients Provided or Recipes Found</h1>
            <p className="text-gray-600">Please go back to the <a href="/" className="text-blue-600 underline">input page</a>.</p>
          </div>
      );
  }

  return (
    <div>
      <Head>
        <title>Search Results | Budget-Chef</title>
      </Head>

      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {recipes.length} Budget-Friendly Recipes Found
          </h1>
          <p className="text-gray-600 mb-8">
            Based on your pantry, here are the most cost-efficient recipes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}