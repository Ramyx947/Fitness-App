import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./statistics.css";

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `http://localhost:5050/stats/${currentUser}`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data.stats);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, [currentUser]);

  const currentUserData = data.find((item) => item.username === currentUser);

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
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

export default Statistics;

Statistics.propTypes = {
  currentUser: PropTypes.string.isRequired,
};