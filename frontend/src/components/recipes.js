import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./recipes.css";

const Recipes = ({ currentUser }) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const url = 'http://localhost:5051/';

        axios
            .get(url)
            .then((response) => {
                setRecipes(response.data.recipes);
            })
            .catch((error) => {
                console.error("There was an error fetching the data", error);
            });
    }, [currentUser]);

    return (
        <div className="recipe-container">
            <h4>Recipes</h4>
            {recipes.length === 0 ? (
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
                                <li className="ingredient" key={i}>{ingredient}</li>
                            ))}
                        </ul>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

export default Recipes;

Recipes.propTypes = {
    currentUser: PropTypes.string.isRequired
};
