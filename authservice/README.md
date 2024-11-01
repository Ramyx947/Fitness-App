# authservice

## Overview
authservice is a Spring Boot application that provides user authentication and registration functionalities.

It provides endpoints for user sign up and login, ensuring secure password handling using Spring Security's PasswordEncoder.

## Features
- User registration with username and password
- User login with username and password
- Password encryption using PasswordEncoder
- Cross-origin resource sharing (CORS) enabled

## Technology Used
- Java
- Spring Boot
- Spring Security
- Spring Data MongoDB
- Gradle

## To build the project
./gradlew clean build

## To run the application
./gradlew bootRun

## To run the tests
./gradlew test

# API Endpoints

### User Registration

- URL: /api/auth/signup
- Method: POST
- Request Body: 
```json
   {
    "username": "newuser",
    "password": "password123"
    }
```
        
Responses:
- 200 OK: User registered successfully
- 400 Bad Request: User already exists - please login

### User Login

- URL: /api/auth/signup
- Method: POST
- Request Body:
```json
   {
    "username": "existinguser",
    "password": "password123"
    }
```

- Responses:
- 200 OK: User authenticated
- 401 Unauthorized: invalid credentials

## Project structure

```text

└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── authservice
    │   │           └── auth
    │   │               ├── AuthApplication.java
    │   │               ├── config
    │   │               │   └── SecurityConfig.java
    │   │               ├── controller
    │   │               │   └── AuthController.java
    │   │               ├── model
    │   │               │   └── User.java
    │   │               └── repository
    │   │                   └── UserRepository.java
    │   └── resources
    │       └── application.properties
    └── test
        └── java
            └── com
                └── authservice
                    └── auth
                        └── AuthserviceApplicationTests.java
```
