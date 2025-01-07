import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Journal from '../../components/journal';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock axios to simulate fetching data
jest.mock('axios');

// Mock currentUser for testing
const mockCurrentUser = 'testuser';

describe('Journal Component Accessibility Tests', () => {
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          weekly: {
            success: true,
            errors: [],
            results: [{ exercises: [{ exerciseType: 'Running', totalDuration: 30 }] }], 
          },
        },
      },
    });
  });

  it('should render and be navigable with keyboard', async () => {
    await act(async () => {
      render(<Journal currentUser={mockCurrentUser} />);
    });

    const previousButton = screen.getByText('← Previous');
    const nextButton = screen.getByText('Next →');

    userEvent.tab();
    expect(previousButton).toHaveFocus(); // Check if the previous button has focus

    userEvent.tab();
    expect(nextButton).toHaveFocus(); // Check if the next button has focus

    // Simulate Enter keypress to activate the previous button
    await act(async () => {
      userEvent.keyboard('{enter}');
    });
    expect(axios.post).toHaveBeenCalledTimes(2);

    // Simulate Space keypress to activate the next button
    await act(async () => {
      userEvent.keyboard(' ');
    });
    expect(axios.post).toHaveBeenCalledTimes(3);
  });

  it('should navigate backwards through focusable elements using Shift + Tab', async () => {
    await act(async () => {
      render(<Journal currentUser={mockCurrentUser} />);
    });

    const previousButton = screen.getByText('← Previous');
    const nextButton = screen.getByText('Next →');
  
    nextButton.focus();
    expect(nextButton).toHaveFocus(); // Focus should be on the "Next" button
  
    userEvent.tab({ shift: true });
    expect(previousButton).toHaveFocus(); // Focus should be on the "Previous" button
  });
});
