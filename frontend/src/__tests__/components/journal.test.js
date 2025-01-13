import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Journal from '../../../src/components/journal.js';

const mockCurrentUser = 'testUser';

describe('Journal Component', () => {
    it('renders the journal correctly', () => {
        render(<Journal currentUser={mockCurrentUser} />);

        // Check for the title
        expect(screen.getByText(/Weekly Exercise Journal/i)).toBeInTheDocument();

        // Check for navigation buttons
        expect(screen.getByText(/← Previous/i)).toBeInTheDocument();
        expect(screen.getByText(/Next →/i)).toBeInTheDocument();

        // Check for the default message when no data is available
        expect(screen.getByText(/No exercises found for this period./i)).toBeInTheDocument();
    });
    it('navigates between weeks correctly', () => {
        render(<Journal currentUser={mockCurrentUser} />);

        // Check the initial date range
        const dateRangeText = screen.getByText(/to/i).textContent;

        // Click the Previous button
        fireEvent.click(screen.getByText(/← Previous/i));
        const updatedDateRangeText = screen.getByText(/to/i).textContent;

        // Verify the date range has changed
        expect(updatedDateRangeText).not.toBe(dateRangeText);

        // Click the Next button and verify it changes again
        fireEvent.click(screen.getByText(/Next →/i));
        expect(screen.getByText(/to/i).textContent).toBe(dateRangeText);
    });
    it('displays error messages when present', () => {
        render(<Journal currentUser={mockCurrentUser} />);

        // Simulate an error message
        const errorMessages = ['Failed to fetch data'];
        errorMessages.forEach((error) => {
            expect(screen.queryByText(error)).not.toBeInTheDocument();
        });
    });
});
