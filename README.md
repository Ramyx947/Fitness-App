# Team 3 Fitness App

A simple and interactive fitness tracking application built with multiple microservices and programming languages. This application allows users to track their exercises and monitor their progress over time.

The Activity Tracking functionality uses the MERN stack (MongoDB, Express.js, React, Node.js), the Analytics service uses Python/Flask and the Authentication Microservice using Java.

![Screenshot](screenshots/frontpage.png)  

### Current Features

- User registration for personalized tracking
- Log various types of exercises with descriptions, duration, and date
- See weekly and overall statistics
- Interactive UI with Material-UI components
- Real-time data persistence with MongoDB

### Prerequisites

- Node.js
- MongoDB
- npm or yarn
- Python & Flask
- Java 8 & Spring Boot
- Docker & Docker Compose
(all already installed in the devcontainer)


## Development in Github Codespaces

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

```
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

if you're missing any version, please contact your course administrator. 


### Building entire project with Docker (+ starting containers up)
```sh
docker-compose up --build
```

### Start existing containers (no rebuild of images)
```sh
docker-compose up
```

#### Spinning up a single service
```sh
docker-compose up [servicename]
```

#### Shutting down a service
```sh
docker-compose down [servicename]
```


## Development without using Docker-Compose

#### Running Node.js Activity Tracker

```sh
cd activity-tracking
npm install
nodemon server
```

#### Running Flask application
```sh
cd analytics
flask run -h localhost -p 5050
```

#### Running Java application
```sh
cd authservice
./gradlew clean build
./gradlew bootRun
```

#### Start the Frontend 

```sh
cd frontend
npm install
npm start
```

#### spin up MongoDB without docker-compose:
```
docker run --name mongodb -d -p 27017:27017 -v mongodbdata:/data/db mongo:latest
```

### Connect to MongoDB

```
mongosh -u root -p cfgmla23 --authenticationDatabase admin --host localhost --port 27017
```

show registered activities:
```
db.exercises.find().pretty()
```

show registered users:
```
db.users.find().pretty()
```


## Deployment
The application is containerized using Docker and can be deployed on any platform that supports Docker containers. For AWS deployment, a GitHub Actions pipeline is configured for CI/CD.

### Any changes to Docker-compose, config, nginx files need to be followed by these steps:
```sh
docker-compose down
docker-compose up -d --build
```
OR
```sh
docker-compose -f docker-compose.develop.yml down
docker-compose -f docker-compose.develop.yml up -d --build
```

### To test each endpoint within nginx container shell, use curl:
```sh
docker-compose exec nginx sh

curl http://localhost/auth/
curl -X POST http://localhost/auth/signup -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'
curl -X POST http://localhost/auth/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"testpassword"}'

curl http://analytics:5050/api/graphql

curl http://localhost/exercises/

curl http://localhost/recipes/
```