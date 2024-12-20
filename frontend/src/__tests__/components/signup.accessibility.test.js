import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../../../src/components/signup.js';
import { signupUser } from '../../api';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../api.js');

describe('Signup Component - Keyboard Accessibility', () => {
  let mockOnSignup;

  beforeEach(() => {
    mockOnSignup = jest.fn();
    jest.clearAllMocks();
  });

  it('can navigate through form fields using Tab', () => {
    render(
        <MemoryRouter>
            <Signup onSignup={mockOnSignup} />
        </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    // Focus on the username field first
    userEvent.tab();
    expect(usernameInput).toHaveFocus();

    // Tab to the password field
    userEvent.tab();
    expect(passwordInput).toHaveFocus();

    // Tab to the submit button
    userEvent.tab();
    expect(submitButton).toHaveFocus();
  });

  it('can submit the form using the Enter key', async () => {
    signupUser.mockResolvedValueOnce({}); // Mock successful signup API call

    render(
      <MemoryRouter>
        <Signup onSignup={mockOnSignup} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign Up/i });

    // Type in the username and password fields
    await act(async () => {
      await userEvent.type(usernameInput, 'testuser');
      await userEvent.type(passwordInput, 'password123');
    });

    // Press Enter to submit the form
    await act(async () => {
      await userEvent.type(submitButton, '{enter}');
    });

    // Check if the signupUser function was called with the correct values
    expect(signupUser).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });

    // Check if onSignup was called with the correct username
    expect(mockOnSignup).toHaveBeenCalledWith('testuser');
  });

  it('can navigate backwards through the form elements using Shift + Tab', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>  {/* Set initial route */}
        <Signup onSignup={jest.fn()} />
      </MemoryRouter>
    );

    // Get all form elements
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

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
});
