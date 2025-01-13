# MLA Fitness App

## Table of Contents

- [Project Overview](#project-overview)
- [Current Features](#current-features)
- [System architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
    - [Steps to Set Up the .env File](#steps-to-set-up-the-env-file)
- [Communication Protocols](#communication-protocols)
- [Communication Between Microservices with NGINX](#communication-between-microservices-with-nginx)
    - [Nginx routes](#nginx-routes)
- [CORS Policy](#cors-policy)
- [Setting up the project](#setting-up-the-project)
    - [Prerequisites](#prerequisites)
    - [Starting a new devcontainer](#starting-a-new-dev-container)
    - [Database Configuration](#database-configuration)
- [Running the app locally](#running-the-app-locally)
    - [Without Docker Compose](#without-docker-compose)
    - [Using Docker Compose](#using-docker-compose)
- [API overview](#api-overview)
    - [REST APIs](#rest-apis)
    - [GraphQL APIs](#graphql-apis)
- [Deployment](#deployment)
    - [Triggers](#triggers)
    - [Stages](#stages)
    - [Secure storing of sensitive credentials](#secure-storage-of-sensitive-credentials)
    - [Dynamic generation of environment variables](#dynamic-generation-of-environment-variables)
    - [Dependabot](#dependabot-integration)
    - [Monitoring and analytics](#monitoring-and-analytics)
        - [Prometheus](#prometheus-scraping-metrics)
        - [Grafana](#grafana)

### Project Overview

A simple and interactive fitness tracking application built with multiple microservices and programming languages. This application allows users to track their exercises and monitor their progress over time.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js), the Analytics service uses Python/Flask and the Authentication Microservice using Java.

[Back to Table of Contents](#table-of-contents)

### Current Features

- User registration for personalized tracking
- Log various types of exercises (descriptions, duration, and date)
- Weekly and overall exercise statistics
- Interactive UI built with Material-UI components
- Real-time data persistence with MongoDB
- Integration with Prometheus and Grafana for monitoring and analytics

![Screenshot](screenshots/frontpage.png)

[Back to Table of Contents](#table-of-contents)

### System Architecture

This application follows a microservice architecture:

- Frontend: Built using React, it interacts with backend services via REST and GraphQL APIs.
- Activity Tracking Service: Handles exercise logging and retrieval (Node.js, Express.js, MongoDB).
- Analytics Service: Processes fitness statistics and metrics (Python, Flask, GraphQL).
- Auth Service: Manages user authentication and credentials (Java, Spring Boot).
- Recipes Service: Suggests recipes based on user preferences (Python, GraphQL).
- Database: MongoDB stores data for each service in isolated collections.
- Reverse Proxy: NGINX routes requests to appropriate backend services.

[Back to Table of Contents](#table-of-contents)

### Technologies Used

- Frontend: React, Material-UI
- Backend: Node.js, Express.js, Python (Flask), Java (Spring Boot)
- Database: MongoDB
- Containerization: Docker, Docker Compose
- Monitoring: Prometheus, Grafana

[Back to Table of Contents](#table-of-contents)

### Environment Variables

Before running the app, ensure you have the correct environment variables set up. Sensitive information like database credentials should never be committed to the repository.

#### Steps to Set Up the .env File:
- Copy the `.env.example` file
- Populate the .env file with the required values. For sensitive information (e.g., database credentials), contact one of Team 3's members.
- Ensure the .env file is present in the root directory

[Back to Table of Contents](#table-of-contents)

### Communication Protocols

- **REST APIs**: Used for predictable request/response operations (Activity-tracking service, Auth service).
- **GraphQL APIs**: Used for flexible querying and efficient data retrieval (Analytics service, Recipes service).

[Back to Table of Contents](#table-of-contents)

### Communication Between Microservices with NGINX

NGINX is configured to act as a reverse proxy to manage communication between the microservices in the application. It routes requests to the appropriate backend service based on the URL paths.

#### NGINX Routes
- Frontend serves static files and proxies API calls to their respective services.
- Activity Tracking Service: /api/activity → http://activity-tracking:5300
- Analytics Service: /api/analytics → http://analytics:5050
- Recipes Service: /api/recipes → http://recipes:5051
- Auth Service: /api/auth → http://authservice:8080

In addition to routing requests, NGINX is also responsible for handling CORS (Cross-Origin Resource Sharing). Any CORS headers previously managed by individual microservices have been removed, and CORS policies are now centralized in the NGINX configuration. This ensures consistency and simplifies the management of CORS rules across the application.

[Back to Table of Contents](#table-of-contents)

### CORS Policy

The following CORS headers are applied by NGINX for API requests:

- `Access-Control-Allow-Origin: *` (or a specific domain in production)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

**Note:**
We are aware that the current configuration with `Access-Control-Allow-Origin: *` is not secure. This setup is intentional for development purposes to simplify testing and integration. In other environments (e.g., testing, production), the CORS headers will be updated to ensure a secure configuration. For example:

- Testing: `Restrict Access-Control-Allow-Origin` to trusted testing domains.
- Production: Set `Access-Control-Allow-Origin` to the specific production domain (e.g., https://fit.com) and include additional security headers like `Access-Control-Allow-Credentials: true` if needed.

By keeping CORS rules centralized in NGINX, we ensure consistency and flexibility across different environments, while maintaining a more secure setup for production deployments.


[Back to Table of Contents](#table-of-contents)

### Setting Up the Project

#### Prerequisites

- Node.js
- MongoDB
- npm or yarn
- Python 3
- Flask
- Java 8
- Docker and Docker Compose
**Note:** all are already installed in the devcontainer environment. This setup eliminates the need to manually install dependencies when setting up the development environment or during CI/CD workflows.

#### Starting a new Devcontainer

1. Click on "Code"
2. Switch to the "Codespaces" tab
3. Create new Codespace from main
<img src="screenshots/codespaces.png" width="300"/>


4. Open Codespace in VS code for best experience:
<img src="screenshots/codespaces2.png" width="300"/>


Walktrough:

https://docs.github.com/en/codespaces/developing-in-a-codespace/using-github-codespaces-in-visual-studio-code

#### Check needed packages are installed:
```sh
sh .devcontainer/check-installation.sh
```

expected output:

```sh
Checking installations...
node is /usr/local/bin/node
node is installed with version: v18.16.0
npm is /usr/local/bin/npm
npm is installed with version: 9.5.1
python3 is /usr/bin/python3
python3 is installed with version: Python 3.9.2
pip3 is /usr/bin/pip3
pip3 is installed with version: pip 20.3.4 from /usr/lib/python3/dist-packages/pip (python 3.9)
gradle is /usr/bin/gradle
gradle is installed with version:
------------------------------------------------------------
Gradle 4.4.1
------------------------------------------------------------
......
Done checking installations.
```

**Note:** if you're missing any version, please contact your course administrator.

#### Database Configuration
MongoDB is used for data persistence, with each microservice having its own collection:

- ActivityService: Stores user exercise logs.
- AuthService: Stores user credentials (passwords are hashed using bcrypt).
- AnalyticsService: Aggregates data for analytics.
- RecipesService: Stores recipes and nutritional information.
- MongoDB is set up using Docker and configured with authentication for security. Connection details are managed through environment variables.

### Running the App Locally:

#### Without Docker Compose

**Start Activity Tracking Service:**
```sh
cd activity-tracking
npm install
nodemon server
```
**Start Analytics Service:**

```sh
cd analytics
flask run -h localhost -p 5050
```

**Start Auth Service:**

```sh
cd authservice
./gradlew clean build
./gradlew bootRun
```

**Start Frontend:**
```sh
cd frontend
npm install
npm start
```

**Spin up MongoDB without docker-compose:**
```sh
docker run --name mongodb -d -p 27017:27017 -v mongodbdata:/data/db mongo:latest
```
- show registered activities:
```sh
db.exercises.find()
```

- show registered users:
```sh
db.users.find().pretty()
```


**Using Docker and Docker Compose**

Open Docker Desktop and ensure all containers are up and running.

Inside the repository, within the DevContainer environment, run:

`docker-compose -f docker-compose.develop.yml up --build`

Wait until all services are initialized.

If you encounter errors in specific microservices, follow these steps:

- Navigate into the microservice folder, install dependencies, and check for any issues.
- run the tests to identify any issues,
- check building logs
- Run production builds if needed and verify functionality.

Once resolved, return to the root directory and run the following commands to restart:

```sh
docker-compose -f docker-compose.develop.yml down
docker-compose down --volumes --remove-orphans
docker-compose -f docker-compose.develop.yml up --build
```

After successful build, open the frontend at `http://localhost:80`. NGINX will redirect you to `http://localhost/login`, where you can log in or sign up.

**Different environments**
- Development Mode:
```sh
docker-compose -f docker-compose.develop.yml up --build
```
- Production Mode:
```sh
docker-compose up --build
```
- Shut Down Services:
```sh
docker-compose down
```

**Connect to MongoDB**

```sh
mongosh -u root -p cfgmla23 --authenticationDatabase admin --host localhost --port 27017
```
OR

```sh
docker exec -it team-3-mla-app-mongodb-1 mongosh -u root -p cfgmla23 --authenticationDatabase admin
```

[Back to Table of Contents](#table-of-contents)

### API Overview


The APIs are using different communication protocols:

#### REST APIs:

1. **Auth Service (REST API)**
   Handles user authentication and registration.
   - **Base URL**: `/api/auth`
   - **Example Endpoints**:
     - `POST /signup`: Registers a new user.
          **Possible Response**:
              - `200 OK`: User registered successfully.
              - `400 Bad Request`: Username already exists.
     - `POST /login`: Authenticates an existing user.
          **Possible Response**:
          - `200 OK`: User authenticated.
          - `400 Unauthorized`: Invalid credentials.

2. **Activity Tracking Service (REST API)**
   Manages user activity logs and exercise tracking.
   - **Base URL**: `/api/activity`
   - **Example Endpoints**:
      - `POST /exercises`: Add a new activity log.
      - `GET /exercises`: Retrieve activity logs.

#### GraphQL APIs:
3. **Analytics Service (GraphQL API)**
   Provides fitness analytics through GraphQL queries.
   - **Base URL**: `/api/analytics`
   - **Example Query**:
     - `POST /graphql` with query:
     ```sh
      query {
          weekly(user: "john_doe", start: "2025-01-01", end: "2025-01-07") {
              success
                  results {
                  username,
                  exercises {
                      exerciseType
                      totalDuration
                  }
              }
          }
      }
      ```

4. **Recipes Service (GraphQL API)**
   Suggests recipes based on user preferences using a GraphQL API for customized queries.
   - **Base URL**: `/api/recipes`
   - **Example Query**:
     - `POST /graphql` with query:
     ```sh
      query {
          recipes {
              success,
              results {
                  recipeName
                  ingredients
                  calories
                  nutrients
              }
          }
      }
      ```

[Back to Table of Contents](#table-of-contents)

### Deployment

The application is containerized using Docker and can be deployed on any platform that supports Docker containers.

Deployment Workflow
The deployment process is managed using a CI/CD pipeline in GitHub Actions. This ensures consistent, reliable builds and deployments across environments.

#### Triggers:

The workflow triggers on:
- Push or pull request to develop or CI-workflow branches.
- Manual execution using workflow_dispatch.

#### Stages:

**Linting**
- Linting is run for all services using npm, flake8, or other service-specific tools.
- Ensures code consistency and identifies potential errors early.

**Tests**
- Runs all unit, integration tests for all services (frontend, activity-tracking, analytics, recipes) using their respective test frameworks.

**Docker Image Build**
- Docker images for all microservices are built using docker buildx.
- Tags images with latest for use in development and testing environments
**Notes:**
- Images are not pushed to Docker Hub during the develop workflow. Instead, they are used within the testing branch to validate functionality and identify any runtime issues.
- By identifying and addressing vulnerabilities in the testing phase, we can avoid delays or last-minute fixes during production deployment.
- It ensures a more secure pipeline while providing developers sufficient time to address issues flagged by vulnerability scans.
- When the pipeline progresses to production-ready branches, these images will be rebuilt and pushed to Docker Hub after passing all tests and scans.

**Vulnerability Scanning:**
- Scans Docker images for HIGH and CRITICAL vulnerabilities using Trivy
- This step ensures that potential security issues in base images, dependencies, or custom configurations are flagged early in the development cycle.

**Environment Variable Management**

- Dynamically generates the `.env` file during the workflow.
- Injects sensitive data (e.g., MongoDB credentials) from GitHub Secrets into the runtime environment.

**Post-Execution Cleanup**
- The workflows include cleanup steps to ensure that temporary files (such as .env files or other generated artifacts) are securely removed after the jobs complete. This reduces the risk of accidental exposure of sensitive data.

#### Secure Storage of Sensitive Credentials
- we are using GitHub Secrets for storing sensitive credentials such as MongoDB username and password.

#### Dynamic Generation of Environment Variables
-During CI/CD, required variables (e.g., MONGO_URI, REACT_APP_* URLs) are generated dynamically and injected into the runtime environment
- This ensures:
    - No sensitive information is persisted in the repository or build artifacts
    - Flexibility across different environments (development, testing, production)

#### Dependabot Integration:

- Dependabot monitors dependencies for all services daily.
- Automatically opens pull requests to update outdated dependencies for:
    - npm
    - pip
    - gradle

### Monitoring and analytics

We use prometheus to collect, store and query metrics from the microservices in the application.

#### Prometheus

Prometheus periodically scrapes metrics from the configured targets in its `prometheus.yml` file.

These targets include:
- Frontend (frontend:80)
- Activity Tracking (activity-tracking:5300)
- Analytics (analytics:5050)
- Authentication Service (authservice:8080)

The `metrics_path` is specified where applicable (e.g., `/actuator/prometheus` for the authservice) to indicate the endpoint Prometheus should scrape.

**Accessing Prometheus UI:**
- make sure the container is running with no errors in Docker and
- navigate to `http://localhost:9090`. This is the default Prometheus web interface

#### Grafana
- is used as the visualization platform that integrated Promtheus to create dashboard for monitoring and analyzing the collected metrics.

**Accessing Grafana dashboard:**
- `docker compose up --build`
- `http://localhost:8081/login`
- `username=admin, password=cfgmla23`

In the top left corner, click on the navigation bar, then click on Dashboard.
You will see a dashboard called Application Dashboard.


[Back to Table of Contents](#table-of-contents)
