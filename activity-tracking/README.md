# Activity Tracking Service

## Overview
The Activity Tracking Service is an application designed to track user activites, it allows users to log activities and retrieve activity history.


## Features
- User can log different types of activities with datetimes
- A list of activities can be retreieved for a given user


## Technologies used
MongoDB
Express.js
Node.js


## To run the application
```sh
npm install
nodemon server
```

## To run the tests
To run Jest tests
```sh
npm run test
```

To run Cypress tests, use either of the below
```sh
npm run cy:open

npm run cy:run
```

## API Endpoints
### Retrieve all exercises
- URL: /exercises/
- Method: GET

### Add a new exercise
- URL: /exercises/add
- Method: POST
- Request Body:
```json
{
    "username": "username",
    "exerciseType": "Running",
    "description": "5k Run",
    "duration": "30",
    "date": "2024-10-15T14:40:35.364Z"
}
```

# Retrieve an exercise by ID
- URL: /exercises/:id
- Method: GET

# Delete an exercise by ID
- URL: /exercises/:id
- Method: DELETE

# Update an exercise by ID
- URL: /exercises/update/:id
- Method: PUT 
- Request Body:
```json
{
    "username": "username",
    "description": "5k Run",
    "duration": "30",
    "date": "2024-10-15T14:40:35.364Z"
}
```
