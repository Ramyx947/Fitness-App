import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import IconButton from '@mui/material/IconButton';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getErrorMessage } from '../utils/errorHandle.js';

const TrackExercise = ({ currentUser, trackExercise }) => {
    const [state, setState] = useState({
        exerciseType: '',
        description: '',
        duration: 0,
        date: new Date(),
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            username: currentUser,
            exerciseType: state.exerciseType,
            description: state.description,
            duration: state.duration,
            date: state.date.toISOString(),
        };
        console.log('Submitting data:', dataToSubmit);

        try {
            const response = await trackExercise(dataToSubmit);
            console.log(response.data);

            setState({
                exerciseType: '',
                description: '',
                duration: 0,
                date: new Date(),
            });

            setMessage('Activity logged successfully! Well done!');
            setError(''); // Clear any previous errors
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error('There was an error logging your activity!', err);
            const errorMsg = getErrorMessage(err, 'Logging activity');
            setError(errorMsg);
        }
    };

    return (
        <div>
            <h3>Track exercise</h3>
            <Form onSubmit={onSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
                <Form.Group controlId="formDate" className="form-margin">
                    <Form.Label htmlFor="datePicker">Date:</Form.Label>
                    <DatePicker
                        id="datePicker"
                        selected={state.date}
                        onChange={(date) => setState({ ...state, date })}
                        dateFormat="yyyy/MM/dd"
                    />
                </Form.Group>
                <div style={{ marginBottom: '20px' }}>
                    <IconButton
                        aria-label="Running"
                        color={state.exerciseType === 'Running' ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent propagation to parent
                            setState({ ...state, exerciseType: 'Running' });
                        }}
                    >
                        <DirectionsRunIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        aria-label="Cycling"
                        color={state.exerciseType === 'Cycling' ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent propagation to parent
                            setState({ ...state, exerciseType: 'Cycling' });
                        }}
                    >
                        <DirectionsBikeIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        aria-label="Swimming"
                        color={state.exerciseType === 'Swimming' ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent propagation to parent
                            setState({ ...state, exerciseType: 'Swimming' });
                        }}
                    >
                        <PoolIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        aria-label="Gym"
                        color={state.exerciseType === 'Gym' ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent propagation to parent
                            setState({ ...state, exerciseType: 'Gym' });
                        }}
                    >
                        <FitnessCenterIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                        aria-label="Other"
                        color={state.exerciseType === 'Other' ? 'primary' : 'default'}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent propagation to parent
                            setState({ ...state, exerciseType: 'Other' });
                        }}
                    >
                        <HelpOutlineIcon fontSize="large" />
                    </IconButton>
                </div>
                <Form.Group controlId="description" style={{ marginBottom: '20px' }}>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        required
                        value={state.description}
                        onChange={(e) => setState({ ...state, description: e.target.value })}
                        aria-label="Description"
                    />
                </Form.Group>
                <Form.Group controlId="duration" style={{ marginBottom: '40px' }}>
                    <Form.Label>Duration (in minutes):</Form.Label>
                    <Form.Control
                        type="number"
                        required
                        value={state.duration}
                        onChange={(e) => setState({ ...state, duration: Number(e.target.value) })}
                        aria-label="Duration (in minutes)"
                    />
                </Form.Group>
                <Button variant="success" type="submit">
                    Save activity
                </Button>
            </Form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

TrackExercise.propTypes = {
    currentUser: PropTypes.string.isRequired,
    trackExercise: PropTypes.func.isRequired,
};

export default TrackExercise;
