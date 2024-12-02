import React from 'react';
import { renderWithRouter, screen } from '../../utils/test-utils.js';
import Signup from '../../../src/components/signup.js';
import {
  setupAuthMock,
  fillAndSubmitForm,
  expectErrorMessage,
  expectCallbackNotCalled,
  expectCallbackCalledWith,
} from '../../../utils/authTest';
// import { testForScriptInjection } from '../../../utils/securityTest.js'; // to be used for input validation tests

describe('Signup Component', () => {
    const onSignupMock = jest.fn();
    let mock;
  
    beforeEach(() => {
      mock = setupAuthMock();
      mock.reset();
      onSignupMock.mockClear();
    });
  
    it('renders the signup form correctly', () => {
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    });
  
    it('submits the form successfully and calls onSignup with correct parameters', async () => {
      // Mock successful signup response
      mock.onPost('/api/auth/signup').reply(201, { message: 'User created successfully!' });
  
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      fillAndSubmitForm({
        username: 'newUser',
        password: 'newPass',
        submitButtonLabel: 'Sign Up',
      });
  
      await expectCallbackCalledWith(onSignupMock, 'newUser');
  
      // Optionally check if form fields are reset after successful submission
      expect(screen.getByLabelText(/username/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
    });
  
    it('displays error message for invalid signup (400 Bad Request)', async () => {
      // Mock 400 Bad Request response
      mock.onPost('/api/auth/signup').reply(400, { message: 'Invalid signup data.' });
  
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      fillAndSubmitForm({
        username: 'invalidUser',
        password: 'short', // Suppose password is too short
        submitButtonLabel: 'Sign Up',
      });
  
      await expectErrorMessage('Invalid request. Please check your input and try again.');
      expectCallbackNotCalled(onSignupMock);
    });
  
    it('displays error message for unauthorized signup (401 Unauthorized)', async () => {
      // Mock 401 Unauthorized response
      mock.onPost('/api/auth/signup').reply(401, { message: 'Unauthorized signup attempt.' });
  
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      fillAndSubmitForm({
        username: 'user',
        password: 'pass123',
        submitButtonLabel: 'Sign Up',
      });
  
      await expectErrorMessage('Unauthorized access. Please check your credentials.');
      expectCallbackNotCalled(onSignupMock);
    });
  
    it('displays network error message when signup request fails', async () => {
      // Mock network error
      mock.onPost('/api/auth/signup').networkError();
  
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      fillAndSubmitForm({
        username: 'networkUser',
        password: 'networkPass',
        submitButtonLabel: 'Sign Up',
      });
  
      await expectErrorMessage('Network error. Please check your connection and try again.');
      expectCallbackNotCalled(onSignupMock);
    });
  
    it('displays internal server error message (500 Internal Server Error)', async () => {
      // Mock 500 Internal Server Error response
      mock.onPost('/api/auth/signup').reply(500, { message: 'Server error.' });
  
      renderWithRouter(<Signup onSignup={onSignupMock} />);
  
      fillAndSubmitForm({
        username: 'user500',
        password: 'pass500',
        submitButtonLabel: 'Sign Up',
      });
  
      await expectErrorMessage('Internal server error. Please try again later.');
      expectCallbackNotCalled(onSignupMock);
    });
    // TODO: Fix input validation for signup component
    // it('should not allow script tags in input fields', async () => {
    //     await testForScriptInjection({
    //       component: <Signup onSignup={onSignupMock} />,
    //       onActionMock: onSignupMock,
    //       submitButtonLabel: 'Sign Up',
    //     });
    //   });
  });
