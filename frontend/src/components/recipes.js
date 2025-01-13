import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipesFallback from './recipesFallback';
import Recipe from './recipe.js';
import './recipes.css';

const Recipes = ({ currentUser }) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const url = 'http://localhost:5051/recipes/graphql';
        axios({
            method: 'post',
            url,
            data: {
                query: `query {
                recipes {
                  results {
                    recipeName
                    ingredients {
                    itemName
                    amount
                    }
                    calories
                  }
                }
              }`,
            },
        })
            .then((response) => {
                setRecipes(response.data.data.recipes.results);
            })
            .catch(() => {
                setRecipes(null);
            });
    }, [currentUser]);

    return (
        <div className="recipe-container">
            <h4>Recipes</h4>
            {!recipes || recipes?.length === 0 ? (
                <RecipesFallback />
            ) : (
                <ul className="recipe-list">
                    {recipes.map((recipe, index) => {
                        return <Recipe recipe={recipe} key={index} />;
                    })}
                </ul>
            )}
        </div>
    );
};

export default Recipes;

Recipes.propTypes = {
    currentUser: PropTypes.string.isRequired,
};
