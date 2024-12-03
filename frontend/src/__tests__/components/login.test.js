import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from '../../../src/components/login';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("Login Component", () => {
  let mock;
  const onLoginMock = jest.fn();

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should render the login form", () => {
    render(
      <MemoryRouter>
        <Login onLogin={onLoginMock} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should display error message for invalid credentials", async () => {
    // Mocking an unsuccessful login response with status 401
    mock.onPost(`${process.env.REACT_APP_API_URL || "http://localhost:8080"}/api/auth/login`).reply(401);
  
    render(
      <MemoryRouter>
        <Login onLogin={onLoginMock} />
      </MemoryRouter>
    );
  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "wrongUser" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongPass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
  
    const errorMessage = await screen.findByText((content) => {
      return content.includes("Invalid credentials");
    });
  
    expect(errorMessage).toBeInTheDocument();
  });


  it("should call onLogin function with correct username on successful login", async () => {
    // Mocking a successful login response
    mock.onPost("http://localhost:8080/api/auth/login").reply(200);

    render(
      <MemoryRouter>
        <Login onLogin={onLoginMock} />
      </MemoryRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "correctUser" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "correctPass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Ensure onLogin was called with the correct username
    await screen.findByRole("button", { name: /login/i });
    expect(onLoginMock).toHaveBeenCalledWith("correctUser");
  });

  it("should display error message when login request fails", async () => {
    mock.onPost("http://localhost:8080/api/auth/login").networkError();

    render(
      <MemoryRouter>
        <Login onLogin={onLoginMock} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "user" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errorMessage = await screen.findByText(/failed to login/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
