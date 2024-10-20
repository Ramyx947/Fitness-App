import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./statistics.css";

const Statistics = ({ currentUser, useGraphQL }) => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getStats(currentUser, useGraphQL);
        setData(statsData);
        setMessage(
          useGraphQL
            ? "Statistics fetched successfully using GraphQL!"
            : "Statistics fetched successfully using REST!"
        );
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setMessage(`Error: ${error.message}`);
      }
    };

    fetchStats();
  }, [currentUser, useGraphQL]);

  const currentUserData = data.find((item) => item.username === currentUser);

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {message && <p style={{ color: message.startsWith("Error") ? "red" : "green" }}>{message}</p>}
      {currentUserData ? (
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

Statistics.propTypes = {
  currentUser: PropTypes.string.isRequired,
  useGraphQL: PropTypes.bool.isRequired,
};

export default Statistics;