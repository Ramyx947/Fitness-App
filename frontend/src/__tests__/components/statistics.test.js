import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Statistics from '../../components/statistics.js';
import { jest } from '@jest/globals';

describe('Statistics Component', () => {
    const currentUser = 'testUser';
    let fetchStatisticsMock;

    beforeEach(() => {
        fetchStatisticsMock = jest.fn();
    });

    it('renders the Statistics component with no exercise data', async () => {
        const mockResponse = {
            data: {
                filteredStats: {
                    success: true,
                    errors: [],
                    results: [],
                },
            },
        };

        fetchStatisticsMock.mockResolvedValueOnce(mockResponse);

        render(<Statistics currentUser={currentUser} fetchStatistics={fetchStatisticsMock} />);

        await waitFor(() => {
            expect(screen.getByText(/no exercise data available for you this week/i)).toBeInTheDocument();
        });
    });

    it('renders the Statistics component with exercise data', async () => {
        const mockResponse = {
            data: {
                filteredStats: {
                    success: true,
                    errors: [],
                    results: [
                        {
                            username: currentUser,
                            exercises: [
                                { exerciseType: 'Running', totalDuration: 120 },
                                { exerciseType: 'Cycling', totalDuration: 60 },
                            ],
                        },
                    ],
                },
            },
        };

        fetchStatisticsMock.mockResolvedValueOnce(mockResponse);

        render(<Statistics currentUser={currentUser} fetchStatistics={fetchStatisticsMock} />);

        await waitFor(() => {
            expect(screen.getByText(/running/i)).toBeInTheDocument();
            expect(screen.getByText(/cycling/i)).toBeInTheDocument();
            expect(screen.getByText(/total duration: 120 min/i)).toBeInTheDocument();
            expect(screen.getByText(/total duration: 60 min/i)).toBeInTheDocument();
        });
    });

    it('displays an error message when the API call fails', async () => {
        fetchStatisticsMock.mockRejectedValueOnce(new Error('Network error'));

        render(<Statistics currentUser={currentUser} fetchStatistics={fetchStatisticsMock} />);

        await waitFor(() => {
            expect(screen.getByText(/there was an error fetching the data/i)).toBeInTheDocument();
        });
    });
});
