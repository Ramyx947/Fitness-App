import React from 'react';
import './recipes.css';

const RecipesFallback = () => {
    return (
        <div className="recipe-container">
            <h4>Sorry</h4>
            <p>We are unable to retrieve any recipes - please add some recipes to your collection first. </p>
        </div>
    );
};

export default RecipesFallback;
