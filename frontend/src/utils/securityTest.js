/**
 * Purpose: Helper functions designed to verify that components properly handle and reject script injection attempts (e.g., Cross-Site Scripting attacks).
 * When to Use: Used in Jest unit test to ensure that form inputs do not accept malicious scripts.
 * Why We Have It: To centralize and simplify the testing of input validation against script injections, promoting better security practices throughout the application.
 * Where It's Used: Used in `Login` and `Signup` components tests
 */
import React from 'react';
import { renderWithRouter } from './test-utils.js';
import {
  fillAndSubmitForm,
  expectErrorMessage,
  expectCallbackNotCalled,
} from './authTest.js';

export const testForScriptInjection = async ({ component, onActionMock, submitButtonLabel }) => {
    renderWithRouter(React.cloneElement(component, { onAction: onActionMock }));
  
    fillAndSubmitForm({
      username: '<script>alert("XSS")</script>',
      password: 'password123',
      submitButtonLabel,
    });
  
    await expectErrorMessage('Invalid input');
    expectCallbackNotCalled(onActionMock);
  };
  
  