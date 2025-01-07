import axios from 'axios';

// Centralized URL getters
function getActivityUrl() {
  const activityUrl = process.env.REACT_APP_ACTIVITY_URL;
  return activityUrl || 'http://localhost:5300';
}

function getAuthServiceUrl() {
  const authUrl = process.env.REACT_APP_AUTHSERVICE_URL;
  return authUrl || 'http://localhost:8080';
}

function getAnalyticsUrl() {
  const analyticsUrl = process.env.REACT_APP_ANALYTICS_URL;
  return analyticsUrl || 'http://localhost:5050/api/graphql';
}

function getRecipesUrl() {
  const recipesUrl = process.env.REACT_APP_RECIPES_URL;
  return recipesUrl || 'http://localhost:5051/api/graphql';
}

// Create API instances for each service
const activityApi = axios.create({
  baseURL: getActivityUrl(),
  headers: { 'Content-Type': 'application/json' }
});

const authServiceApi = axios.create({
  baseURL: getAuthServiceUrl(),
  headers: { 'Content-Type': 'application/json' }
});

const analyticsApi = axios.create({
  baseURL: getAnalyticsUrl(),
  headers: { 'Content-Type': 'application/json' }
});

const recipesApi = axios.create({
  baseURL: getRecipesUrl(),
  headers: { 'Content-Type': 'application/json' }
});

// Exported API functions
export const trackExercise = (payload) => activityApi.post('/exercises/add', payload);
export const loginUser = (payload) => authServiceApi.post('/api/auth/login', payload);
export const signupUser = (payload) => authServiceApi.post('/api/auth/signup', payload);
export const fetchStatistics = (variables) => analyticsApi.post('', {
  query: `
    query GetFilteredStats($name: String!) {
      filteredStats(name: $name) {
        success
        errors
        results {
          username
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

export const fetchRecipes = () => recipesApi.post('', {
  query: `query {
    recipes {
      results {
        recipeName
        ingredients {
        itemName
        amount
        }
        calories
      }
    }
  }`
});

// Export default api for backward compatibility
export default activityApi;