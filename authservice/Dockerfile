# Stage 1: Build the application
FROM gradle:7.2-jdk8 AS build

WORKDIR /home/gradle/src

# Copy only the necessary files to leverage Docker cache
COPY build.gradle.kts .
COPY src ./src

# Build the application
RUN gradle bootJar --no-daemon

# Stage 2: Run the application
FROM openjdk:8-jre-slim

# Set a volume for temporary files (optional but recommended)
VOLUME /tmp

# Expose the application port
EXPOSE 8080

# Copy the built JAR from the build stage
COPY --from=build /home/gradle/src/build/libs/*.jar /app/authservice.jar

# Use ENTRYPOINT to define the main command
ENTRYPOINT ["java", "-jar", "/app/authservice.jar"]
