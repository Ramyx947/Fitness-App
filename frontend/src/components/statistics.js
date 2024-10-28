import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./statistics.css";

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `
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
      `;

      const variables = {
        name: currentUser,
      };

      try {
        const response = await axios.post("http://localhost/api/graphql", {
          query,
          variables,
        });

        // Ensure response data is defined and has the expected structure
        const statsResult = response.data?.data?.filteredStats;

        if (statsResult) {
          if (statsResult.success) {
            setData(statsResult.results);
            setErrors([]); // Clear errors if the request is successful
          } else {
            setErrors(statsResult.errors || ["Unknown error occurred"]);
          }
        } else {
          setErrors(["No data found for the current user."]);
        }
      } catch (error) {
        console.error("There was an error fetching the data.", error);
        setErrors([error.message || "An unknown error occurred."]);
      }
    };

    fetchData();
  }, [currentUser]);

  const currentUserData = data.find((item) => item.username === currentUser);

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {errors.length > 0 ? (
        <div className="error-messages">
          {errors.map((error, index) => (
            <p key={index} className="error-text">
              {error}
            </p>
          ))}
        </div>
      ) : currentUserData ? (
        currentUserData.exercises.map((item, index) => (
          <div key={index} className="exercise-data">
            <div>
              <strong>{item.exerciseType}</strong>
            </div>
            <div>Total Duration: {item.totalDuration} min</div>
          </div>
        ))
      ) : (
        <p className="no-data-message">
          No exercise data available for you this week. Keep up the great work and try adding some activities!
        </p>
      )}
    </div>
  );
};

export default Statistics;

Statistics.propTypes = {
  currentUser: PropTypes.string.isRequired,
};
