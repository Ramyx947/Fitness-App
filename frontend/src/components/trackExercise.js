import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { trackExercise } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";
import IconButton from "@mui/material/IconButton";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BikeIcon from "@mui/icons-material/DirectionsBike";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OtherIcon from "@mui/icons-material/HelpOutline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TrackExercise = ({ currentUser }) => {
  const [state, setState] = useState({
    exerciseType: "",
    description: "",
    duration: 0,
    date: new Date(),
  });
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      username: currentUser,
      ...state,
    };

    try {
      const response = await trackExercise(dataToSubmit, useGraphQL);
      console.log(response);

      setState({
        exerciseType: "",
        description: "",
        duration: 0,
        date: new Date(),
      });

      setMessage(
        useGraphQL
          ? "Activity logged successfully using GraphQL! Well done!"
          : "Activity logged successfully using REST! Well done!"
      );
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("There was an error logging your activity!", error);
      setMessage(`Error: ${error.message}`);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div>
      <h3>Track exercise</h3>
      <Form onSubmit={onSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
        <Form.Group controlId="formDate" className="form-margin">
          <Form.Label>Date:</Form.Label>
          <DatePicker
            selected={state.date}
            onChange={(date) => setState({ ...state, date })}
            dateFormat="yyyy/MM/dd"
          />
        </Form.Group>
        <div style={{ marginBottom: "20px" }}>
          <IconButton
            color={state.exerciseType === "Running" ? "primary" : "default"}
            onClick={() => setState({ ...state, exerciseType: "Running" })}
          >
            <DirectionsRunIcon fontSize="large" />
          </IconButton>
          <IconButton
            color={state.exerciseType === "Cycling" ? "primary" : "default"}
            onClick={() => setState({ ...state, exerciseType: "Cycling" })}
          >
            <BikeIcon fontSize="large" />
          </IconButton>
          <IconButton
            color={state.exerciseType === "Swimming" ? "primary" : "default"}
            onClick={() => setState({ ...state, exerciseType: "Swimming" })}
          >
            <PoolIcon fontSize="large" />
          </IconButton>
          <IconButton
            color={state.exerciseType === "Gym" ? "primary" : "default"}
            onClick={() => setState({ ...state, exerciseType: "Gym" })}
          >
            <FitnessCenterIcon fontSize="large" />
          </IconButton>
          <IconButton
            color={state.exerciseType === "Other" ? "primary" : "default"}
            onClick={() => setState({ ...state, exerciseType: "Other" })}
          >
            <OtherIcon fontSize="large" />
          </IconButton>
        </div>
        <Form.Group controlId="description" style={{ marginBottom: "20px" }}>
          <Form.Label>Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            value={state.description}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group controlId="duration" style={{ marginBottom: "40px" }}>
          <Form.Label>Duration (in minutes):</Form.Label>
          <Form.Control
            type="number"
            required
            value={state.duration}
            onChange={(e) => setState({ ...state, duration: e.target.value })}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Save activity
        </Button>
      </Form>
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

TrackExercise.propTypes = {
  currentUser: PropTypes.string.isRequired,
  useGraphQL: PropTypes.bool.isRequired,
};

export default TrackExercise;