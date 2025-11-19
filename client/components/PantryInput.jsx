import { useState } from 'react';

export default function PantryInput({
    pantryItems,
    dietaryPreferences,
    onAddItem,
    onRemoveItem,
    onTogglePreference,
    onGenerate,
    isLoading
}) {
    const [newItem, setNewItem] = useState('');
    const allPreferences = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb'];

    const handleInputSubmit = (e) => {
        // Prevents the page from reloading when the form is submitted
        e.preventDefault(); 
        if (newItem.trim()) {
            onAddItem(newItem.trim().toLowerCase());
            setNewItem('');
        }
    };

    return (
        <div className="input-container">
            <h3 className="title-h3">Your Pantry Ingredients</h3>
            
            {/* Input Form */}
            <form onSubmit={handleInputSubmit} className="input-form">
                <input
                    type="text"
                    placeholder="Add ingredient (e.g., chicken, eggs, flour)"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    className="input-field"
                />
                <button 
                    type="submit" 
                    className="button-primary add-button" 
                    disabled={!newItem}
                >
                    Add Item
                </button>
            </form>

            {/* Added Items List */}
            <div className="ingredient-list-display">
                {pantryItems.length === 0 ? (
                    <p className="tip-text">Start adding what you have!</p>
                ) : (
                    pantryItems.map((item, index) => (
                        <span key={index} className="ingredient-tag">
                            {item}
                            <button 
                                type="button" 
                                onClick={() => onRemoveItem(item)} 
                                aria-label={`Remove ${item}`}
                            >
                                &times;
                            </button>
                        </span>
                    ))
                )}
            </div>

            {/* Dietary Preferences */}
            <div className="preference-group">
                <h3 className="title-h3">Dietary Preferences</h3>
                <div className="preference-options">
                    {allPreferences.map((pref) => (
                        <label key={pref} className="preference-label">
                            <input
                                type="checkbox"
                                checked={dietaryPreferences.includes(pref)}
                                onChange={() => onTogglePreference(pref)}
                            />
                            {pref}
                        </label>
                    ))}
                </div>
            </div>

            {/* Generate Button (This is the main action button) */}
            <button
                onClick={onGenerate} // <-- Calls the function passed from index.js
                className="button-primary generate-button"
                disabled={isLoading || pantryItems.length === 0}
            >
                {isLoading ? 'Generating Recipes...' : 'Generate Recipes'}
            </button>
        </div>
    );
}