/**
 * Purpose: A custom render function that wraps the provided UI component with a `MemoryRouter`, enabling testing of components that rely on React Router without the need for a full browser environment.
 * When to Use: Use this function when writing tests for components that utilize React Router features like `Link`, `Route`, or `useHistory`.
 * Why We Have It: To simplify the testing of routed components by providing the necessary router context, making tests more accurate and easier to write.
 * Where It's Used: Utilized in test files for any component that requires routing context, such as navigation components or pages with internal links.
 */

import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const renderWithRouter  = (ui, { route = '/' } = {}) => {
    return rtlRender(
        <MemoryRouter initialEntries={[route]}>
            {ui}
        </MemoryRouter>
    );
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

export { renderWithRouter  };