/**
 * ErrorBoundary Component
 *
 * **Purpose:**
 * A React component that catches JavaScript errors anywhere in its child component tree, preventing the entire app from crashing and displaying a fallback UI instead.

 * **When to Use:**
 * Wrap this component around parts of your application where you want to handle errors gracefully, such as around high-level routes or components that may throw errors.
 *  * **Why We Have It:**
 * To enhance the application's robustness by catching runtime errors and providing a user-friendly message, improving the overall user experience.
 *  * **Where It's Used:**
 * Typically used in the main `App` component or around major sections of the application to catch and handle errors from child components.
**/

import { screen, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { authServiceApi } from '../api.js';

export const setupAuthMock = () => new MockAdapter(authServiceApi);

export const fillAndSubmitForm = ({ username, password, submitButtonLabel }) => {
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: username } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: new RegExp(submitButtonLabel, 'i') }));
};

export const expectErrorMessage = async (message) => {
  const errorMessage = await screen.findByText(new RegExp(message, 'i'));
  expect(errorMessage).toBeInTheDocument();
};

export const expectCallbackNotCalled = (callback) => {
  expect(callback).not.toHaveBeenCalled();
};

export const expectCallbackCalledWith = async (callback, ...args) => {
  await waitFor(() => expect(callback).toHaveBeenCalledWith(...args));
};