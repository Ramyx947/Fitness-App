import React, { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Button, Form, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            // Remove hardcoded URL, use environment variable instead
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080'

            // Make the API call without assigning to response (we don't need it anywhere)
            await axios.post(`${baseUrl}/api/auth/login`, {
                username,
                password,
            })

            // on successful login
            onLogin(username)
        } catch (err) {
            // Differentiate between different error types
            if (err.response) {
                // Server responded with a status other than 2xx
                if (err.response.status === 401) {
                    setError('Invalid credentials')
                } else {
                    setError(`Error: ${err.response.status} - ${err.response.data.message || 'Unexpected error'}`)
                }
            } else if (err.request) {
                // Request was made but no response was received
                setError('Network error, please try again later.')
            } else {
                // Something else caused the error
                setError('Failed to login due to an unexpected error.')
            }
        }

        return (
            <div className="login-container">
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
        )
    }
}

export default Login

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
}
