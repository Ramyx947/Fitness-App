import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; // Use default render
import App from '../../src/App';
import MockAdapter from 'axios-mock-adapter';
import api, { authServiceApi } from '../../src/api.js';
import dotenv from 'dotenv';
import userEvent from '@testing-library/user-event';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

describe('App Component', () => {
    let apiMock;
    let authMock;

    beforeAll(() => {
        apiMock = new MockAdapter(api); // Mock 'api' instance
        authMock = new MockAdapter(authServiceApi); // Mock 'authServiceApi' instance
    });

    afterEach(() => {
        apiMock.reset();
        authMock.reset();
    });

    afterAll(() => {
        apiMock.restore();
        authMock.restore();
    });

    it('renders App Header', () => {
        // Mock any necessary API calls here if App renders data on mount
        render(<App />);
        expect(screen.getByText(/MLA Fitness App/i)).toBeInTheDocument();
    });

    it('redirects to /login and shows the login form when not authenticated', () => {
        render(<App />, { route: '/' });
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it('renders Navbar when authenticated', async () => {
        // Mock a successful login response
        authMock.onPost('/api/auth/login').reply(200, { message: 'User logged in successfully!' });
    
        render(<App />, { wrapWithRouter: false });
    
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });
    
        await userEvent.type(usernameInput, 'testUser');
        await userEvent.type(passwordInput, 'testPass');
        await userEvent.click(loginButton);
    
        // Wait for Navbar to appear after successful login
        await waitFor(() => {
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });
    });
});
