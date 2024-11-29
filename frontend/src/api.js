import axios from 'axios';

// Centralized API URL
function getApiUrl() {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('API URL:', apiUrl); // For debugging
  return apiUrl || 'http://localhost:5300';
}

// Centralized AuthService URL
function getAuthServiceUrl() {
  const authUrl = process.env.REACT_APP_AUTHSERVICE_URL;
  console.log('AuthService URL:', authUrl); // For debugging
  return authUrl || 'http://localhost:8080';
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Allow requests from any origin
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allow these methods
      'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow these headers
  },
});

export const authServiceApi = axios.create({
  baseURL: getAuthServiceUrl(),
  headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Same CORS headers
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
});


// Exported API functions
export const trackExercise = (payload) => api.post('/exercises/add', payload);
export const loginUser = (payload) => authServiceApi.post('/api/auth/login', payload);
export const signupUser = (payload) => authServiceApi.post('/api/auth/signup', payload);
export const fetchStatistics = (variables) =>
  api.post('/api/graphql', {
      query: `
      query GetWeeklyStats($user: String!, $start: String!, $end: String!) {
        weekly(user: $user, start: $start, end: $end) {
          success
          errors
          results {
            exercises {
              exerciseType
              totalDuration
            }
          }
        }
      }
    `,
      variables,
    });
export const fetchRecipes = () => api.get('/recipes');

// Export default axios instance for general usage if needed
export default api;
