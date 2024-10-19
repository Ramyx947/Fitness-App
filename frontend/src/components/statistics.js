import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./statistics.css";

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = `http://localhost:5050/api/graphql`;
    const query = `
    query {
      filteredStats(name: "${currentUser}") {
        success
        errors
        results {
            username
            exercises {
                exerciseType
                totalDuration
           } }
    } }
  `;

    console.log(`Sending request to ${url} with query:`, query); // Log before the request

    axios
      .post(url, {
        query: query,
      })
      .then((response) => {
        const result = response.data.data.filteredStats;
        if (result.success) {
          setData(result.results);
        } else {
          setError(result.errors);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the data", error);
        setError("Network or sever error");
      })
      .finally(() => {
        setLoading(false);
      })
  }, [currentUser]);

  const currentUserData = data.find((item) => item.username === currentUser);

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
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
        <p>No data available</p>
      )}
    </div>
  );
};

export default Statistics;

Statistics.propTypes = {
  currentUser: PropTypes.string.isRequired,
};
