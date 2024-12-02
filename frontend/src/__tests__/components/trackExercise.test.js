import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TrackExercise from '../../../src/components/trackExercise.js';

// Mock Props
const mockCurrentUser = 'testUser';

// Define a mock function for trackExercise
const mockTrackExercise = jest.fn();

// Helper Function to Render Component
const renderComponent = () => {
  render(<TrackExercise currentUser={mockCurrentUser} trackExercise={mockTrackExercise} />);
};

describe('TrackExercise Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    renderComponent();

    // Check for heading
    expect(screen.getByText(/Track exercise/i)).toBeInTheDocument();

    // Check for DatePicker
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();

    // Check for Exercise Type Buttons (IconButtons)
    expect(screen.getAllByRole('button')).toHaveLength(6); // 5 IconButtons + Submit Button

    // Check for Description
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();

    // Check for Duration
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();

    // Check for Submit button
    expect(screen.getByRole('button', { name: /save activity/i })).toBeInTheDocument();
  });

  it('allows user to select an exercise type', () => {
    renderComponent();

    // Select the Running button by aria-label
    const runningButton = screen.getByRole('button', { name: /running/i });
    fireEvent.click(runningButton);

    // Ensure no error messages are displayed
    expect(screen.queryByText(/failed to log activity/i)).not.toBeInTheDocument();
  });

  it('allows user to input description and duration', () => {
    renderComponent();

    const descriptionInput = screen.getByLabelText(/description/i);
    const durationInput = screen.getByLabelText(/duration/i);

    // Simulate entering description
    fireEvent.change(descriptionInput, { target: { value: 'Morning run in the park.' } });
    expect(descriptionInput).toHaveValue('Morning run in the park.');

    // Simulate entering duration
    fireEvent.change(durationInput, { target: { value: '30' } });
    expect(durationInput).toHaveValue(30);
  });

  it('submits the form successfully and displays success message', async () => {
    renderComponent();

    // Mock successful API response
    mockTrackExercise.mockResolvedValue({ data: { message: 'Activity logged successfully!' } });

    // Select an exercise type (Running)
    const runningButton = screen.getByRole('button', { name: /running/i });
    fireEvent.click(runningButton);

    // Enter description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Morning run in the park.' } });

    // Enter duration
    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '30' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    // Wait for the success message to appear
    const successMessage = await screen.findByText(/activity logged successfully! well done!/i);
    expect(successMessage).toBeInTheDocument();

    // Ensure that the form has been reset
    expect(descriptionInput).toHaveValue('');
    expect(durationInput).toHaveValue(0);
  });

  it('handles 400 Bad Request error gracefully and displays correct error message', async () => {
    renderComponent();

    // Mock 400 Bad Request response
    mockTrackExercise.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Invalid input data.' },
      },
    });

    // Select an exercise type (Cycling)
    const cyclingButton = screen.getByRole('button', { name: /cycling/i });
    fireEvent.click(cyclingButton);

    // Enter description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Evening cycling session.' } });

    // Enter duration
    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '45' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    // Wait for the specific error message to appear
    const errorMessage = await screen.findByText(/invalid request\. please check your input and try again\./i);
    expect(errorMessage).toBeInTheDocument();

    // Ensure that the form has not been reset
    expect(descriptionInput).toHaveValue('Evening cycling session.');
    expect(durationInput).toHaveValue(45);
  });

  it('handles 401 Unauthorized error gracefully and displays correct error message', async () => {
    renderComponent();

    // Mock 401 Unauthorized response
    mockTrackExercise.mockRejectedValue({
      response: {
        status: 401,
        data: {},
      },
    });

    // Select an exercise type (Swimming)
    const swimmingButton = screen.getByRole('button', { name: /swimming/i });
    fireEvent.click(swimmingButton);

    // Enter description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Afternoon swim.' } });

    // Enter duration
    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '60' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    // Wait for the specific error message to appear
    const errorMessage = await screen.findByText(/unauthorized access\. please check your credentials\./i);
    expect(errorMessage).toBeInTheDocument();

    // Ensure that the form has not been reset
    expect(descriptionInput).toHaveValue('Afternoon swim.');
    expect(durationInput).toHaveValue(60);
  });

  it('handles network errors gracefully and displays correct error message', async () => {
    renderComponent();

    // Mock network error
    mockTrackExercise.mockRejectedValue(new Error('Network Error'));

    // Select an exercise type (Gym)
    const gymButton = screen.getByRole('button', { name: /gym/i });
    fireEvent.click(gymButton);

    // Enter description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Evening gym session.' } });

    // Enter duration
    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '50' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    // Wait for the specific error message to appear
    const errorMessage = await screen.findByText(/network error\. please check your connection and try again\./i);
    expect(errorMessage).toBeInTheDocument();

    // Ensure that the form has not been reset
    expect(descriptionInput).toHaveValue('Evening gym session.');
    expect(durationInput).toHaveValue(50);
  });

  it('displays the success message temporarily and hides it after 2 seconds', async () => {
    jest.useFakeTimers();
    renderComponent();

    // Mock successful API response
    mockTrackExercise.mockResolvedValue({ data: { message: 'Activity logged successfully!' } });

    // Select an exercise type (Swimming)
    const swimmingButton = screen.getByRole('button', { name: /swimming/i });
    fireEvent.click(swimmingButton);

    // Enter description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Afternoon swim.' } });

    // Enter duration
    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '60' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    // Check for success message
    const successMessage = await screen.findByText(/activity logged successfully! well done!/i);
    expect(successMessage).toBeInTheDocument();

    // Fast-forward time by 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for the success message to disappear
    await waitFor(() => {
      expect(screen.queryByText(/activity logged successfully! well done!/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  // TODO: Add input validation tests
});
