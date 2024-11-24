import PropTypes from 'prop-types';
import React from 'react';

const Recipe = (props) => {
    const { recipeName, ingredients, calories } = props.recipe;
    const caloriesText = calories ? ` (${calories}kcal)` : '';

    return (
        <li className="recipe-item">
            <h2 className="recipe-name">{recipeName}</h2>

            {!!calories && <h5 className="recipe-name">{caloriesText}</h5>}
            <h5>Ingredients:</h5>
            <ul>
                {ingredients.map(({ itemName, amount }, i) => (
                    <li className="ingredient" key={i}>
                        {`${itemName}: ${amount}g`}
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default Recipe;

Recipe.propTypes = {
    recipe: PropTypes.shape({
        recipeName: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(
            PropTypes.shape({
                itemName: PropTypes.string.isRequired,
                amount: PropTypes.number.isRequired,
            })
        ).isRequired,
        calories: PropTypes.number,
    }).isRequired,
};
