import React from 'react';
import PropTypes from 'prop-types';
import './recipes.css';

const Recipes = ({ recipes, error }) => {
    return (
        <div className="recipe-container">
            <h4>Recipes</h4>
            {error ? (
                <p className="error-text">{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found</p>
            ) : (
                <ul className="recipe-list">
                    {recipes.map((recipe, index) => (
                        <li className="recipe-item" key={index}>
                            <h2 className="recipe-name">{recipe.name}</h2>
                            <p className="cooking-time">Cooking Time: {recipe.cookingTime}</p>
                            <h5>Ingredients:</h5>
                            <ul>
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li className="ingredient" key={i}>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Recipes;

Recipes.propTypes = {
    recipes: PropTypes.array.isRequired,
    error: PropTypes.string,
};
