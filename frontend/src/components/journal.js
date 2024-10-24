import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import moment from "moment";
import "./journal.css";

const Journal = ({ currentUser }) => {
  const [startDate, setStartDate] = useState(moment().startOf("week").toDate());
  const [endDate, setEndDate] = useState(moment().endOf("week").toDate());
  const [exercises, setExercises] = useState([]);
  const [errors, setErrors] = useState([]);

  const fetchExercises = async () => {
    try {
      const query = `
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
      `;

      const variables = {
        user: currentUser,
        start: moment(startDate).format("YYYY-MM-DD"),
        end: moment(endDate).format("YYYY-MM-DD"),
      };

      const response = await axios.post(
        'http://localhost:5050/api/graphql',
        {
          query,
          variables,
        }
      );

      const weeklyStats = response.data.data.weekly;

      if (weeklyStats.success) {
        // Extract exercises from results
        const allExercises = weeklyStats.results.flatMap(result => result.exercises);
        setExercises(allExercises);
      } else {
        setErrors(weeklyStats.errors.length > 0 ? weeklyStats.errors : ["An unknown error occurred. Please try again later."]);
      }
    } catch (error) {
      console.error("Failed to fetch exercises", error);
      setErrors([error.response ? error.response.data.error : "No data found for the provided date range for the current user."]);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [currentUser, startDate, endDate]);

  const goToPreviousWeek = () => {
    setStartDate(
      moment(startDate).subtract(1, "weeks").startOf("week").toDate()
    );
    setEndDate(moment(endDate).subtract(1, "weeks").endOf("week").toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, "weeks").startOf("week").toDate());
    setEndDate(moment(endDate).add(1, "weeks").endOf("week").toDate());
  };

  return (
    <div className="journal-container">
      <h4>Weekly Exercise Journal</h4>
      <br />
      <div className="date-range">
        <Button className="button-small" onClick={goToPreviousWeek}>
          &larr; Previous
        </Button>
        <span>
          {moment(startDate).format("YYYY-MM-DD")} to{" "}
          {moment(endDate).format("YYYY-MM-DD")}
        </span>
        <Button className="button-small" onClick={goToNextWeek}>
          Next &rarr;
        </Button>
      </div>
      <ul>
        {errors.length > 0 ? (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-text">
                {error}
              </p>
            ))}
          </div>
        ) : exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <li key={index} className="exercise-journal-data">
              {exercise.exerciseType} - {exercise.totalDuration} minutes
            </li>
          ))
        ) : (
          <li>No exercises found for this period.</li>
        )}
      </ul>
    </div>
  );
};

export default Journal;

Journal.propTypes = {
  currentUser: PropTypes.string.isRequired,
};
