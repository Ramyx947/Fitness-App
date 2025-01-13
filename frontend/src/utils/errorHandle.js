/**
 * Purpose: Processes error objects from HTTP responses and returns user-friendly error messages based on the status code and context.
 * When to use: Use this function when handling exceptions from API calls to provide meaningful feedback to the user.
 * Why we have it: To ensure consistency in error messaging across the application, making it easier to manage and maintain error handling logic.
 * When to Use: Use in any component that handles API errors to provide consistent messaging
 */
export const getErrorMessage = (err, context = '') => {
    console.log('Error object received in getErrorMessage:', err);

    const errorMessages = {
        400: 'Invalid request. Please check your input and try again.',
        401: 'Unauthorized access. Please check your credentials.',
        403: 'You do not have permission to perform this action.',
        404: context ? `${context} not found. Please try again.` : 'Resource not found. Please try again.',
        500: 'Internal server error. Please try again later.',
    };
    if (err.response) {
        const { status } = err.response;
        return errorMessages[status] || 'An unexpected error occurred. Please try again later.';
    }

    // Handle network or other errors
    return 'Network error. Please check your connection and try again.';
};