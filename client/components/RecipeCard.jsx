import Link from 'next/link';

export default function RecipeCard({ recipe }) {
    
    return (
        // The Link component is styled using the .recipe-card class
        <Link href={`/recipe/${recipe.id}`} className="recipe-card">
            
            <h3 className="card-title">{recipe.title}</h3>
            
            {/* Placeholder details for a consistent look */}
            <div className="card-details">
                <p className="card-info">Time: {recipe.total_prep_time || '30 min'}</p>
                <p className="card-info">Efficiency: {recipe.cost_efficiency ? (recipe.cost_efficiency * 100).toFixed(0) + '%' : 'N/A'}</p>
            </div>
            
            <div className="card-tags-container">
                {(recipe.dietary_tags || ['Quick', 'Budget']).map((tag) => (
                    <span key={tag} className="card-tag">
                        {tag}
                    </span>
                ))}
            </div>

        </Link>
    );
}