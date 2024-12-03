/**
 * ErrorBoundary Component
 * Purpose: A React component that catches JavaScript errors anywhere in its child component tree, preventing the entire app from crashing and displaying a fallback UI instead.
 * When to Use: Wrap this component around parts of your application where you want to handle errors gracefully, such as around high-level routes or components that may throw errors.
 * Why We Have It:  To enhance the application's robustness by catching runtime errors and providing a user-friendly message, improving the overall user experience.
 * Where It's Used: Typically used in the main `App` component or around major sections of the application to catch and handle errors from child components.
 */
import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state to display fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

// Add prop validation for `children`
ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;