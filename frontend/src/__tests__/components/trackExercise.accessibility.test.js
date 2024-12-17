import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TrackExercise from '../../components/trackExercise';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock functions for testing
const mockTrackExercise = jest.fn();
const mockCurrentUser = 'testUser';

const renderComponent = () => {
  render(<TrackExercise currentUser={mockCurrentUser} trackExercise={mockTrackExercise} />);
};

describe('TrackExercise component keyboard accessibility', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    /*it('should navigate through form fields using the Tab key', async () => {
        renderComponent();
      
        const dateInput = screen.getByLabelText(/date/i);

        // Use act to wrap the focus and tab key press to ensure state updates and DOM changes are handled
        await act(async () => {
            dateInput.focus(); // Focus the date input

            // Simulate pressing Tab to navigate through the fields
            userEvent.tab();
        });

        const runningButton = screen.getByLabelText(/Running/i);
        expect(runningButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const cyclingButton = screen.getByRole('button', { name: /cycling/i });
        expect(cyclingButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const swimmingButton = screen.getByRole('button', { name: /swimming/i });
        expect(swimmingButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const gymButton = screen.getByRole('button', { name: /gym/i });
        expect(gymButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const otherButton = screen.getByRole('button', { name: /other/i });
        expect(otherButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const descriptionInput = screen.getByLabelText(/description/i);
        expect(descriptionInput).toHaveFocus();
    
        await act(async () => {
            userEvent.tab();
        });
    
        const durationInput = screen.getByLabelText(/duration/i);
        expect(durationInput).toHaveFocus();
    });*/

    it('should navigate backwards through exercise type buttons using tab', async () => {
        renderComponent();
      
        // Focus on the last element (Duration)
        const durationInput = screen.getByLabelText(/duration/i);
    
        await act(async () => {
            durationInput.focus();
        });
        expect(durationInput).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const descriptionInput = screen.getByLabelText(/description/i);
        expect(descriptionInput).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const otherButton = screen.getByRole('button', { name: /other/i });
        expect(otherButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const gymButton = screen.getByRole('button', { name: /gym/i });
        expect(gymButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const swimmingButton = screen.getByRole('button', { name: /swimming/i });
        expect(swimmingButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const cyclingButton = screen.getByRole('button', { name: /cycling/i });
        expect(cyclingButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const runningButton = screen.getByRole('button', { name: /running/i });
        expect(runningButton).toHaveFocus();
    
        await act(async () => {
            userEvent.tab({ shift: true });
        });
        const dateInput = screen.getByLabelText(/date/i);
        expect(dateInput).toHaveFocus();
    });

    it('allows interaction with form elements using keyboard', async () => {
        renderComponent();
    
        // Focus on the description input and type text
        const descriptionInput = screen.getByLabelText(/description/i);
        descriptionInput.focus();
        userEvent.type(descriptionInput, 'Morning run');
        expect(descriptionInput).toHaveValue('Morning run');
    
        const runningButton = screen.getByRole('button', { name: /running/i });
        userEvent.click(runningButton);

        // Focus on the duration input and type a number
        const durationInput = screen.getByLabelText(/duration/i);
        durationInput.focus();
        userEvent.type(durationInput, '30');
        expect(durationInput).toHaveValue(30);
    
        // Submit the form using the Enter key
        const submitButton = screen.getByRole('button', { name: /save activity/i });
        submitButton.focus();
        userEvent.keyboard('{enter}');
    
        // Check that the submit function was called
        await waitFor(() => expect(mockTrackExercise).toHaveBeenCalledTimes(1));
    });

    it('allows activation of exercise type buttons using keyboard', async () => {
        renderComponent();
        
        // Ensure that the "Running" button can be focused and activated with Enter key
        const runningButton = screen.getByLabelText(/Running/i);
        runningButton.focus();
        expect(runningButton).toHaveFocus();
    
        // Press Enter to select "Running"
        userEvent.keyboard('{enter}');
        expect(runningButton).toHaveClass('MuiIconButton-colorPrimary');
    
        // Ensure that the "Cycling" button can be focused and activated with Enter key
        const cyclingButton = screen.getByLabelText(/Cycling/i);
        cyclingButton.focus();
        expect(cyclingButton).toHaveFocus();
    
        // Press Enter to select "Cycling"
        userEvent.keyboard('{enter}');
        expect(cyclingButton).toHaveClass('MuiIconButton-colorPrimary');
    });

    it('should focus on the Date picker input field and be able to select a date using keyboard', async () => {
        renderComponent();

        const dateInput = screen.getByLabelText(/date/i);
        await act(async () => {
            dateInput.focus(); // Focus the date input
            userEvent.keyboard('{ArrowDown}'); // Simulate ArrowDown key press
        });

        await waitFor(() => {
            expect(dateInput).toHaveFocus(); // Ensure it remains focused
        });
    });

    it('closes date picker when Esc key is pressed while in focus', async () => {
        renderComponent();

        // Get the date input field by label and focus on it to open the DatePicker
        const dateInput = screen.getByLabelText('Date:');
        userEvent.click(dateInput);

        // Check if the date picker is open
        const datePickerContainer = document.querySelector('.react-datepicker');
        expect(datePickerContainer).toBeInTheDocument();

        // Simulate pressing the Esc key while the DatePicker is in focus
        userEvent.keyboard('{Escape}');

        // Wait for the DatePicker to close and check if it's removed from the document
        await waitFor(() => {
            expect(datePickerContainer).not.toBeInTheDocument();
        });
    });
});
