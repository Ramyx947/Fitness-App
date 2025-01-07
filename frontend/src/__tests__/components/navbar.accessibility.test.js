import React from 'react';
import { render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Navbar - Keyboard accessibility', () => {
    const mockOnLogout = jest.fn();

    beforeEach(() => {
        // Reset before each test
        useNavigate.mockClear();
        mockOnLogout.mockClear();
    });

    it('should render navbar links correctly', () => {
        render(<Navbar onLogout={mockOnLogout} />);

        // Check if the navbar links are in the document
        expect(screen.getByText('Track New Exercise')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(screen.getByText('Weekly Journal')).toBeInTheDocument();
        expect(screen.getByText('Recipes')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should navigate through the navbar using the Tab key', () => {
        render(<Navbar onLogout={mockOnLogout} />);

        // Move focus to first navbar item (Track New Exercise)
        const trackExercise = screen.getByText('Track New Exercise');
        trackExercise.focus();
        expect(trackExercise).toHaveFocus();
    
        // Press Tab to focus the next link (Statistics)
        userEvent.tab();
        expect(screen.getByText('Statistics')).toHaveFocus();
    
        // Press Tab to focus the next link (Weekly Journal)
        userEvent.tab();
        expect(screen.getByText('Weekly Journal')).toHaveFocus();
    
        // Press Tab to focus the next link (Recipes)
        userEvent.tab();
        expect(screen.getByText('Recipes')).toHaveFocus();
    
        // Press Tab to focus the last link (Logout)
        userEvent.tab();
        expect(screen.getByText('Logout')).toHaveFocus();
    });

    it('should navigate backwards through the navbar using Shift + Tab', () => {
        render(<Navbar onLogout={mockOnLogout} />);

        //Move focus to last navbar item (Logout)
        const logout = screen.getByText('Logout');
        logout.focus();
        expect(logout).toHaveFocus();

        // Press Shift + Tab to move backwards to Recipes
        userEvent.tab({ shift: true });
        expect(screen.getByText('Recipes')).toHaveFocus();

        // Press Shift + Tab to move backwards to Weekly Journal
        userEvent.tab({ shift: true });
        expect(screen.getByText('Weekly Journal')).toHaveFocus();

        // Press Shift + Tab to move backwards to Statistics
        userEvent.tab({ shift: true });
        expect(screen.getByText('Statistics')).toHaveFocus();

        // Press Shift + Tab to move backwards to Track New Exercise
        userEvent.tab({ shift: true });
        expect(screen.getByText('Track New Exercise')).toHaveFocus();
    });

    it('should activate a navbar item by pressing Enter or Space', () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        render(<Navbar onLogout={mockOnLogout} />);

        const trackExerciseLink = screen.getByText('Track New Exercise');
        const statisticsLink = screen.getByText('Statistics');
        const journalLink = screen.getByText('Weekly Journal');
        const recipesLink = screen.getByText('Recipes');
        const logoutLink = screen.getByText('Logout');

        // Simulate focus on the "Track New Exercise" link and press Enter
        userEvent.tab();
        userEvent.type(trackExerciseLink, '{enter}');
        expect(navigateMock).toHaveBeenCalledWith('/trackExercise');

        // Simulate focus on the "Statistics" link and press Space
        userEvent.tab();
        userEvent.type(statisticsLink, '{space}');
        expect(navigateMock).toHaveBeenCalledWith('/statistics');

        // Simulate focus on the "Weekly Journal" link and press Enter
        userEvent.tab();
        userEvent.type(journalLink, '{enter}');
        expect(navigateMock).toHaveBeenCalledWith('/journal');

        // Simulate focus on the "Recipes" link and press Space
        userEvent.tab();
        userEvent.type(recipesLink, '{space}');
        expect(navigateMock).toHaveBeenCalledWith('/recipes');

        // Simulate focus on the "Logout" button and press Enter
        userEvent.tab();
        userEvent.type(logoutLink, '{enter}');
        expect(mockOnLogout).toHaveBeenCalled();
    });

    it('should activate logout button via keyboard (Enter/Space)', async () => {
        render(<Navbar onLogout={mockOnLogout} />);
    
        const logoutLink = screen.getByText('Logout');
        logoutLink.focus();
        expect(logoutLink).toHaveFocus();
    
        // Simulate pressing Enter to trigger logout
        userEvent.type(logoutLink, '{enter}');
        expect(mockOnLogout).toHaveBeenCalled();
    });
});
