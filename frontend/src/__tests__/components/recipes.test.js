import React from 'react';
import { render, screen } from '@testing-library/react';
import Recipes from '../../components/recipes.js';

describe('Recipes Component', () => {
    it('renders the Recipes component with no recipes', () => {
        render(<Recipes recipes={[]} error="" />);

        expect(screen.getByRole('heading', { name: /recipes/i, level: 4 })).toBeInTheDocument();
        expect(screen.getByText(/no recipes found/i)).toBeInTheDocument();
    });

    it('renders the Recipes component with a list of recipes', () => {
        const mockRecipes = [
            {
                name: 'Pasta',
                cookingTime: '30 minutes',
                ingredients: ['Noodles', 'Sauce'],
            },
            {
                name: 'Pizza',
                cookingTime: '20 minutes',
                ingredients: ['Dough', 'Cheese', 'Tomato Sauce'],
            },
        ];

        render(<Recipes recipes={mockRecipes} error="" />);

        // Check for recipe names
        expect(screen.getByText(/pasta/i)).toBeInTheDocument();
        expect(screen.getByText(/pizza/i)).toBeInTheDocument();

        // Check for cooking times
        expect(screen.getByText(/cooking time: 30 minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/cooking time: 20 minutes/i)).toBeInTheDocument();

        // Check for ingredients
        expect(screen.getAllByText(/ingredients:/i).length).toBe(2);
    });

    it('displays an error message when there is an error', () => {
        render(<Recipes recipes={[]} error="There was an error fetching the data" />);

        expect(screen.getByRole('heading', { name: /recipes/i, level: 4 })).toBeInTheDocument();
        expect(screen.getByText(/there was an error fetching the data/i)).toBeInTheDocument();
    });
});
