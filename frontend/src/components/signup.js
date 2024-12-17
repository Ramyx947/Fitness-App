import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signupUser } from '../api.js';
import { getErrorMessage } from '../utils/errorHandle.js';

const Signup = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await signupUser({ username, password });
            onSignup(username); // Inform App.js of successful signup
            // Reset the form values on successful submission
            setUsername('');
            setPassword('');
        } catch (err) {
            const errorMsg = getErrorMessage(err, 'Signup');
            setError(errorMsg);
        }
    };

    return (
        <div className="signup-container">
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSignup}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        aria-label="Username"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Password"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{ marginTop: '20px' }}>
                    Sign Up
                </Button>
            </Form>

            <p className="mt-3">
                {"Already have an account?"} <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

Signup.propTypes = {
    onSignup: PropTypes.func.isRequired,
};

export default Signup;
