import React from 'react';
import './recipes.css';

const RecipesFallback = () => {
    return (
        <div className="recipe-container">
            <h4>Sorry</h4>
            <p>We are unable to retrieve Recipes right now, please try again soon! </p>
        </div>
    );
};

export default RecipesFallback;
