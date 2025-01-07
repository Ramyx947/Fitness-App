import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Login from '../../../src/components/login';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock the axios.post function
jest.mock('axios');

// Mock the onLogin function
const mockOnLogin = jest.fn();

describe('Login Component Accessibility', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    );
  });

  it('should focus elements in tab order', () => {
    // Tab through the elements and ensure the focus moves correctly
    const usernameField = screen.getByLabelText(/Username/i);
    const passwordField = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Focus on the username field
    usernameField.focus();
    expect(usernameField).toHaveFocus();

    // Press Tab to move to password field
    userEvent.tab();
    expect(passwordField).toHaveFocus();

    // Press Tab again to move to the login button
    userEvent.tab();
    expect(loginButton).toHaveFocus();
  });

  it('can navigate backwards through the form elements using Shift + Tab', () => {
    // Get all form elements by their role
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /Login/i });

    // Focus on the username input field
    submitButton.focus();
    expect(submitButton).toHaveFocus();

    // Press Shift + Tab again to go back to the password input
    userEvent.tab({ shift: true }); 
    expect(passwordInput).toHaveFocus();

    // Press Shift + Tab again to go back to the username input
    userEvent.tab({ shift: true }); 
    expect(usernameInput).toHaveFocus();
  });

  it('should trigger login on Enter key press', async () => {
    // Mock the API call to resolve successfully
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const usernameField = screen.getByLabelText(/Username/i);
    const passwordField = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Fill out the form
    await userEvent.type(usernameField, 'testuser');
    await userEvent.type(passwordField, 'password123');

    // Press Enter on the login button
    await userEvent.type(loginButton, '{enter}');

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('testuser');
    });
  });

  it('should be able to navigate to the signup page using keyboard', () => {
    const signupLink = screen.getByText(/Sign up/i);

    // Focus on the signup link and simulate pressing Enter
    signupLink.focus();
    userEvent.type(signupLink, '{enter}');

    // Check that the link to the signup page was activated
    waitFor(() => {
        expect(window.location.pathname).toBe('/signup');
      });
  });

  it('should handle Escape key properly', () => {
    const usernameField = screen.getByLabelText(/Username/i);

    // Focus on the username field
    usernameField.focus();
    expect(usernameField).toHaveFocus();

    // Press Escape and check that the focus does not leave the input
    userEvent.type(usernameField, 'Escape');
    expect(usernameField).toHaveFocus();
  });
});
