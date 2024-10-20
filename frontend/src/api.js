import axios from 'axios';

function getUrl() {
    if (process.env.CODESPACES === "true") {
        return `https://${process.env.CODESPACE_NAME}-5300.app.github.dev`;
    } else {
        return `http://localhost:5300`;
    }
}

const baseURL = getUrl();

const api = axios.create({
    baseURL
});

// use REST API
const trackExerciseREST = payload => api.post(`/exercises/add`, payload);

// use GraphQL API
const trackExerciseGraphQL = async (payload) => {
    const query = `
      mutation AddExercise($input: ExerciseInput!) {
        addExercise(input: $input) {
          success
          errors
          exercise {
            id
            username
            exerciseType
            duration
            date
          }
        }
      }
    `;
  
    const variables = {
      input: payload,
    };
  
    try {
      const response = await api.post('/api/graphql', {
        query,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("GraphQL Error:", error);
      throw error;
    }
  };
  
  const getStatsGraphQL = async (name = null) => {
    const query = name
      ? `
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
      `
      : `
        query GetStats {
          stats {
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
      `;
  
    const variables = name ? { name } : {};
  
    try {
      const response = await api.post('/api/graphql', {
        query,
        variables,
      });
      return response.data;
    } catch (error) {
      console.error("GraphQL Error:", error);
      throw error;
    }
  };
  
  // Unified API Functions
  export const trackExercise = async (payload, useGraphQL) => {
    if (useGraphQL) {
      const data = await trackExerciseGraphQL(payload);
      // Use GraphQL response structure
      if (data.data.addExercise.success) {
        return data.data.addExercise.exercise;
      } else {
        throw new Error(data.data.addExercise.errors.join(', '));
      }
    } else { // default: REST call
      const response = await trackExerciseREST(payload);
      return response.data; // Adjust based on REST API response structure
    }
  };
  
  export const getStats = async (name = null, useGraphQL) => {
    if (useGraphQL) {
      const data = await getStatsGraphQL(name);
      if (name) {
        if (data.data.filteredStats.success) {
          return data.data.filteredStats.results;
        } else {
          throw new Error(data.data.filteredStats.errors.join(', '));
        }
      } else {
        if (data.data.stats.success) {
          return data.data.stats.results;
        } else {
          throw new Error(data.data.stats.errors.join(', '));
        }
      }
    } else {
      if (name) { // Please check these correspond to the previous REST api structure
        const response = await api.get(`/stats/${name}`);
        return response.data; // Adjust based on REST API response structure
      } else {
        const response = await api.get('/stats');
        return response.data; // Adjust based on REST API response structure
      }
    }
  };