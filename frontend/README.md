# Frontend README

Welcome to the frontend of the MLA app!

## Overview

The Frontend Service of the MLA app is a web application that provides users with an interface to interact with the backend services. It allows users to log activities and view activity history and statistics.

## Features

## Technologies used

- **React.js**: For building the user interface.
- **Redux**: For state management.
- **Axios**: For making API calls to the backend services.
- **CSS/SCSS**: For styling the application.
- **React Router**: For handling navigation within the application.

## Installation

To get started, follow these steps:

1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the development server.

## To run/build with Docker Compose

### Building the service

```sh
docker-compose build frontend
```

### Start the service

```sh
docker-compose up frontend
```

### Stop the service

```sh
docker-compose down frontend
```

## To run the tests

To run Jest tests

```sh
npm run test
```

## Usage
