import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recipes from '../../components/recipes';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('Login Component', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
    });

    afterAll(() => {
        mock.restore();
    });

    it('Should render fallback page when request fails', async () => {
        mock.onPost('http://localhost:5051/api/graphql').reply(500);

        await act(async () => {
            render(
                <MemoryRouter>
                    <Recipes currentUser="test-user" />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Sorry/i)).toBeInTheDocument();
    });

    it('Should render fallback page when there are no recipes', async () => {
        mock.onPost('http://localhost:5051/api/graphql').reply(200, {
            data: { recipes: [] },
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <Recipes currentUser="test-user" />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Sorry/i)).toBeInTheDocument();
    });

    it('Should render recipe when there are recipes', async () => {
        mock.onPost('http://localhost:5051/api/graphql').reply(200, {
            data: {
                recipes: {
                    results: [{ id: 1, recipeName: 'test-recipe-1', ingredients: [{ itemName: 'test-item-1', amount: 100 }] }],
                },
            },
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <Recipes currentUser="test-user" />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/test-recipe-1/i)).toBeInTheDocument();
        expect(screen.getByText(/test-item-1/i)).toBeInTheDocument();
    });
});
