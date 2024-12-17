import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

describe('App Component - Images and alt text test', () => {
    it('should have the correct alt text for the logo image', () => {
        const { getByAltText } = render(<App />);

        // Get the image by its alt text
        const logoImage = getByAltText('CFG Fitness App Logo');

        // Assert the image is in the document
        expect(logoImage).toBeInTheDocument();
    });

    it('should not have an empty alt text for images', () => {
        const { queryByAltText } = render(<App />);

        // Assert the image does not have an empty alt text
        const logoImage = queryByAltText('');
        expect(logoImage).toBeNull();  // Ensure no image has empty alt text
    });
});
