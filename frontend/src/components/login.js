import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { loginUser } from '../api.js';
import { getErrorMessage } from '../utils/errorHandle.js';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await loginUser({ username, password });
            onLogin(username, password); // Pass both username and password
        } catch (err) {
            console.error('Login error:', err);
            setError(getErrorMessage(err, 'Login failed.'));
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    Login
                </Button>
            </Form>

            <p className="mt-3">
                {"Don't have an account?"} <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
