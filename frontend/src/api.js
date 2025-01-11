import axios from 'axios';

// Centralized URL getters
// Use a relative path to route through Nginx
// if using .env file remove the relative paths (increase security)
function getActivityUrl() {
  const activityUrl =  process.env.REACT_APP_ACTIVITY_URL;
  return activityUrl || '/api/activity'
}

function getAuthServiceUrl() {
  const authUrl = process.env.REACT_APP_AUTHSERVICE_URL;
  return authUrl || '/api/auth';
}

function getAnalyticsUrl() {
  const analyticsUrl = process.env.REACT_APP_ANALYTICS_URL;
  return analyticsUrl || '/api/analytics/graphql';
}

function getRecipesUrl() {
  const recipesUrl = process.env.REACT_APP_RECIPES_URL;
  // Use a relative path to route through Nginx
  return recipesUrl || '/api/recipes/graphql';
}

// Create API instances for each service
const activityApi = axios.create({
  baseURL: getActivityUrl(),
  headers: { 'Content-Type': 'application/json' }
});

export const authServiceApi = axios.create({
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
export const trackExercise = (payload) => activityApi.post('/exercises/add', {
  username: payload.username || 'testUser',
  exerciseType: payload.exerciseType || 'Running',
  description: payload.description || '',
  duration: payload.duration,
  date: payload.date || new Date().toISOString(),  // Use current date if not provided
});
export const loginUser = (payload) => authServiceApi.post('/login', payload);
export const signupUser = (payload) => authServiceApi.post('/signup', payload);
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