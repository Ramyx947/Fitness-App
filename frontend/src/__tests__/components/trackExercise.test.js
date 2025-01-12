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

    expect(screen.getByText(/Track exercise/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(6);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save activity/i })).toBeInTheDocument();
  });

  it('allows user to select an exercise type', () => {
    renderComponent();

    const runningButton = screen.getByRole('button', { name: /running/i });
    fireEvent.click(runningButton);

    expect(screen.queryByText(/failed to log activity/i)).not.toBeInTheDocument();
  });

  it('allows user to input description and duration', () => {
    renderComponent();

    const descriptionInput = screen.getByLabelText(/description/i);
    const durationInput = screen.getByLabelText(/duration/i);

    fireEvent.change(descriptionInput, { target: { value: 'Morning run in the park.' } });
    expect(descriptionInput).toHaveValue('Morning run in the park.');

    fireEvent.change(durationInput, { target: { value: '30' } });
    expect(durationInput).toHaveValue(30);
  });

  it('submits the form successfully and displays success message', async () => {
    renderComponent();

    // mockTrackExercise.mockResolvedValue({ data: { message: 'Activity logged successfully!' } });
    mockTrackExercise.mockResolvedValueOnce({ data: { message: 'Activity logged successfully!' } });

    const runningButton = screen.getByRole('button', { name: /running/i });
    fireEvent.click(runningButton);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Morning run in the park.' } });

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '30' } });

    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    const successMessage = await screen.findByText(/activity logged successfully! well done!/i);
    expect(successMessage).toBeInTheDocument();

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

    const cyclingButton = screen.getByRole('button', { name: /cycling/i });
    fireEvent.click(cyclingButton);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Evening cycling session.' } });

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '45' } });

    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/invalid request\. please check your input and try again\./i);
    expect(errorMessage).toBeInTheDocument();

    expect(descriptionInput).toHaveValue('Evening cycling session.');
    expect(durationInput).toHaveValue(45);
  });

  it('handles 401 Unauthorized error gracefully and displays correct error message', async () => {
    renderComponent();

    mockTrackExercise.mockRejectedValue({
      response: {
        status: 401,
        data: {},
      },
    });

    const swimmingButton = screen.getByRole('button', { name: /swimming/i });
    fireEvent.click(swimmingButton);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Afternoon swim.' } });

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '60' } });

    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/unauthorized access\. please check your credentials\./i);
    expect(errorMessage).toBeInTheDocument();

    expect(descriptionInput).toHaveValue('Afternoon swim.');
    expect(durationInput).toHaveValue(60);
  });

  it('handles network errors gracefully and displays correct error message', async () => {
    renderComponent();

    mockTrackExercise.mockRejectedValue(new Error('Network Error'));

    const gymButton = screen.getByRole('button', { name: /gym/i });
    fireEvent.click(gymButton);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Evening gym session.' } });

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '50' } });

    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(/network error\. please check your connection and try again\./i);
    expect(errorMessage).toBeInTheDocument();

    expect(descriptionInput).toHaveValue('Evening gym session.');
    expect(durationInput).toHaveValue(50);
  });

  it('displays the success message temporarily and hides it after 2 seconds', async () => {
    jest.useFakeTimers();
    renderComponent();

    mockTrackExercise.mockResolvedValue({ data: { message: 'Activity logged successfully!' } });

    const swimmingButton = screen.getByRole('button', { name: /swimming/i });
    fireEvent.click(swimmingButton);

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Afternoon swim.' } });

    const durationInput = screen.getByLabelText(/duration/i);
    fireEvent.change(durationInput, { target: { value: '60' } });

    const submitButton = screen.getByRole('button', { name: /save activity/i });
    fireEvent.click(submitButton);

    const successMessage = await screen.findByText(/activity logged successfully! well done!/i);
    expect(successMessage).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText(/activity logged successfully! well done!/i)).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
  // TODO: Add input validation tests
});
