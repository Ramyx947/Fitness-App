import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import './statistics.css';

const Statistics = ({ currentUser, fetchStatistics }) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        const getStats = async () => {
            try {
                const response = await fetchStatistics({ name: currentUser });
                if (response.data.filteredStats.success) {
                    setData(response.data.filteredStats.results);
                } else {
                    setError('There was an error fetching the data');
                }
            } catch (err) {
                setError('There was an error fetching the data');
            }
        };

        getStats();
    }, [currentUser, fetchStatistics]);

    if (error) {
        return (
            <div className="stats-container">
                <p>{error}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="stats-container">
                <p>No exercise data available for you this week</p>
            </div>
        );
    }

    return (
        <div className="stats-container">
            <h4>Overall effort:</h4>
            {data.map((userStat, index) => (
                <div key={index} className="exercise-container">
                    {userStat.exercises.map((exercise, i) => (
                        <div key={i} className="exercise-stats">
                            <p className="exercise-type">{exercise.exerciseType}</p>
                            <p className="total-duration">Total Duration: {exercise.totalDuration} min</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

Statistics.propTypes = {
    currentUser: PropTypes.string.isRequired,
    fetchStatistics: PropTypes.func.isRequired,
};

export default Statistics;
