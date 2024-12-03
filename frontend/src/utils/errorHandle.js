/**
 * Purpose: Processes error objects from HTTP responses and returns user-friendly error messages based on the status code and context.
 * When to use: Use this function when handling exceptions from API calls to provide meaningful feedback to the user.
 * Why we have it: To ensure consistency in error messaging across the application, making it easier to manage and maintain error handling logic.
 * When to use: Used in various components that make API calls, such as `Login`, `Signup`, and data-fetching components, to interpret and display error messages to the user.
 */
export const getErrorMessage = (err, context = '') => {
    if (err.response) {
        // Server responded with a status other than 2xx
        if (typeof err.response.data === 'string') {
            return err.response.data;
        }
        switch (err.response.status) {
            case 400:
                return 'Invalid request. Please check your input and try again.';
            case 401:
                return 'Unauthorized access. Please check your credentials.';
            case 403:
                return 'You do not have permission to perform this action.';
            case 404:
                return `${context || 'Resource'} not found. Please try again.`;
            case 500:
                return 'Internal server error. Please try again later.';
            default:
                return `An error occurred: ${err.response.data.message || 'Unexpected error.'}`;
        }
    } else {
        // Something else caused the error
        return 'Network error. Please check your connection and try again.';
    }
};