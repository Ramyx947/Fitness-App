import React from "react";
import { renderWithRouter, screen } from "../../../src/utils/test-utils";
import Login from "../../../src/components/login";
import {
  setupAuthMock,
  fillAndSubmitForm,
  expectErrorMessage,
  expectCallbackNotCalled,
  expectCallbackCalledWith,
} from "../../../src/utils/authTest";

describe("Login Component", () => {
  const onLoginMock = jest.fn();
  let mock;

  beforeEach(() => {
    mock = setupAuthMock();
    mock.reset();
    onLoginMock.mockClear();
  });

  it("should render the login form", () => {
    renderWithRouter(<Login onLogin={onLoginMock} />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });

  it("should submit the form successfully and call onLogin with correct parameters", async () => {
    mock.onPost("/api/auth/login").reply(200, { username: "correctUser" });

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({
      username: "correctUser",
      password: "correctPass",
      submitButtonLabel: "Login",
    });

    await expectCallbackCalledWith(onLoginMock, "correctUser");
  });

  it("should display an error message for invalid credentials (401 Unauthorized)", async () => {
    mock.onPost("/api/auth/login").reply(401);

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({
      username: "wrongUser",
      password: "wrongPass",
      submitButtonLabel: "Login",
    });

    await expectErrorMessage("Unauthorized access. Please check your credentials.");
    expectCallbackNotCalled(onLoginMock);
  });

  it("should display an error message when login request fails with a network error", async () => {
    mock.onPost("/api/auth/login").networkError();

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({
      username: "networkUser",
      password: "networkPass",
      submitButtonLabel: "Login",
    });

    await expectErrorMessage("Network error. Please check your connection and try again.");
    expectCallbackNotCalled(onLoginMock);
  });

  it("should display an error message for internal server error (500)", async () => {
    mock.onPost("/api/auth/login").reply(500, { message: "Internal server error" });

    renderWithRouter(<Login onLogin={onLoginMock} />);

    fillAndSubmitForm({
      username: "user500",
      password: "pass500",
      submitButtonLabel: "Login",
    });

    await expectErrorMessage("Internal server error. Please try again later.");
    expectCallbackNotCalled(onLoginMock);
  });
});
