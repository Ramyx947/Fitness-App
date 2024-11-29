import React from 'react';
import { renderWithRouter , screen } from '../utils/test-utils.js';
import Signup from '../../src/components/signup.js';
import MockAdapter from 'axios-mock-adapter';
import { authServiceApi } from '../api.js';

const mock = new MockAdapter(authServiceApi);

describe('Signup Component', () => {
    const onSignupMock = jest.fn();

    beforeEach(() => {
        mock.reset();
        onSignupMock.mockClear();
    });

    it('renders the signup form correctly', () => {
        renderWithRouter (<Signup onSignup={onSignupMock} />); // Automatically wrapped with MemoryRouter

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });

    // ... other tests
});
