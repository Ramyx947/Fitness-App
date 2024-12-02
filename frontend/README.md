# Frontend
The frontend service is a React-based web application for the MLA Fitness App. It provides an interactive user interface for tracking exercises, monitoring progress, managing recipes, and more. It uses environment variables for flexible configuration and supports CI/CD workflows for seamless deployment.

## Setup
The frontend is built with create-react-app and uses Node.js for dependency management.

### Quickstart: Set up the project
Clone the repository and navigate to the frontend directory:

- `git clone <repository-url>`
- `cd frontend`

### Install dependencies using npm:
- `npm install`

### Start the development server:
#### Start the Frontend 

- `npm start`

#### By default, the app will be available at http://localhost:3000.

### Environment Variables
The app uses .env files for environment configuration. These variables are injected during build time and control the application's behavior for different environments (development, QA, main/production).

## Project Structure
The key directories and files in the project are:

frontend/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable React components (e.g., Navbar, Login)
│   ├── pages/             # Page-level components (e.g., Statistics, Recipes)
│   ├── api/               # Axios API calls (e.g., trackExercise, loginUser)
│   ├── utils/             # Utility functions (e.g., error handling)
│   ├── tests/             # Unit and integration tests
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   └── jest.setup.js      # Jest setup file for testing
├── .env                   # Default environment variables
├── .env.dev               # Development environment variables
├── .env.qa                # QA environment variables
├── package.json           # Project metadata and scripts
└── Dockerfile             # Docker configuration

### Centralized API Calls
To improve maintainability and consistency, all API calls have been centralized in the `src/api.js` file. This approach ensures:

- Single Source of Truth for API URLs and functions.
- Simplified API management, where changes to endpoints or configurations can be made in one place.
- Better separation of concerns between components and data-fetching logic.

#### The centralized API includes the following functions:

- loginUser: Authenticates a user.
- signupUser: Registers a new user.
- trackExercise: Adds a new exercise.
- fetchStatistics: Retrieves filtered statistics using GraphQL.
- fetchRecipes: Fetches recipes for authenticated users.

#### Environment-Specific Base URLs:

The app determines the API base URL dynamically based on the environment variables (`REACT_APP_API_URL` and `REACT_APP_AUTHSERVICE_URL`) or the `Codespaces` configuration. This allows seamless deployment in development, staging, and production environments.

### Reusable Components
The application is modularized, with reusable components such as NavbarComponent, Footer, Login, and others located in the src/components folder. These components focus on specific UI or functionality to enhance readability and reusability.

### Error Handling
An ErrorBoundary component (located in src/utils/ErrorBoundary.js) has been added to handle uncaught errors gracefully, ensuring better user experience and debugging.

### Utils Folder
The utils folder contains utility functions and components that are reused across the application. 

Current contents:

- `customDateInput.js`: Defines a reusable CustomDateInput component for integrating a custom date picker input with React. This component is used as the customInput in react-datepicker to maintain consistent styling and accessibility.
- `ErrorBoundary.js`: A React error boundary to catch runtime errors and display fallback UI.
- `errorHandle.js`: Provides the getErrorMessage function to standardize error handling across the application. This function parses error responses and returns user-friendly messages based on the HTTP status code or context.
- `test-utils.js`: Custom utilities for testing, including an enhanced render method using MemoryRouter for React Router testing.

### Routing Enhancements
Routing is managed using react-router-dom and includes dynamic redirects based on authentication status:

- Unauthenticated users are redirected to `/login`.
- Authenticated users have access to protected routes like `/trackExercise`, `/statistics`, `/journal`, and `/recipes`.

## Running the Application

### Start the Development Server
- `npm start`

### Build for Production
- `npm run build`

### Running the Application in Docker
Build and run the containerized frontend:

- `docker build -t mla-frontend .`
- `docker run -p 3000:3000 mla-frontend`

## Running Tests and linting

### Running the Test Suite for Specific Environments

- `npm run test:dev`
- `npm run test:qa`
- `npm run test:main`

### Run specific test 
-`npm run test:dev src/__tests__/components/<test-file-name>`

#### Clear jest cache
-`npx jest --clearCache`

### Linting
Running ESLint
`npm run lint`

Fixing Lint Issues
`npm run lint:fix`

### Integrations tests with Cypress
`cy:run`

Docker Setup

The Dockerfile sets up the frontend application for containerized deployment.


## Troubleshooting

### Common Issues
- Missing Environment Variables: Ensure the `.env` file is properly set up for the intended environment.

- Dependencies Not Installed: Run `npm install` to ensure all dependencies are installed.

- Linting Errors: Use `npm run lint:fix` to automatically resolve common linting issues.

- Docker Issues: Verify Docker installation and configuration with:
`docker --version`