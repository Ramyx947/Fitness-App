import React from "react";
import { renderWithRouter , screen } from '../../utils/test-utils.js'
import Login from '../../components/login.js';
import {
  setupAuthMock,
  fillAndSubmitForm,
  expectErrorMessage,
  expectCallbackNotCalled,
  expectCallbackCalledWith,
} from '../../utils/authTest.js';
// import { testForScriptInjection } from '../../utils/securityTest.js'; // to be used for input validation tests

describe('Login Component', () => {
  const onLoginMock = jest.fn();
  let mock;

  beforeEach(() => {
    mock = setupAuthMock();
    mock.reset();
    onLoginMock.mockClear();
  });

  it('should render the login form', () => {
    renderWithRouter(<Login onLogin={onLoginMock} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should display error message for invalid credentials', async () => {
    mock.onPost('/api/auth/login').reply(401, 'Invalid credentials');

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({ username: 'wrongUser', password: 'wrongPass', submitButtonLabel: 'Login' });

    await expectErrorMessage('Invalid credentials');
    expectCallbackNotCalled(onLoginMock);
  });

  it('should call onLogin with correct username and password on successful login', async () => {
    mock.onPost('/api/auth/login').reply(200, 'User authenticated');

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({ username: 'correctUser', password: 'correctPass', submitButtonLabel: 'Login' });

    await expectCallbackCalledWith(onLoginMock, 'correctUser', 'correctPass');
  });

  it('should display error message when login request fails', async () => {
    mock.onPost('/api/auth/login').networkError();

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({ username: 'user', password: 'pass', submitButtonLabel: 'Login' });

    await expectErrorMessage('Network error. Please check your connection and try again.');
    expectCallbackNotCalled(onLoginMock);
  });
  // TODO: Fix input validation for login component
  // it('should not allow script tags in input fields', async () => {
  //   await testForScriptInjection({
  //     component: <Login />,
  //     onActionMock: onLoginMock,
  //     submitButtonLabel: 'Login',
  //   });
  // });
});