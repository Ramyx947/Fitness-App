
# ------------------------------
# Stage 1: Base - Install System Dependencies and Node.js
# ------------------------------
    FROM ubuntu:20.04 AS base

    # Prevent interactive prompts during package installation
    ENV DEBIAN_FRONTEND=noninteractive
    
    # Install necessary system dependencies
    RUN apt-get update && \
        apt-get install -y \
          curl \
          git \
          unzip \
          tar \
          build-essential \
          libssl-dev \
          && rm -rf /var/lib/apt/lists/*
    
    # Install Node.js 18.x
    RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
        apt-get install -y nodejs && \
        rm -rf /var/lib/apt/lists/*
    
    # Update npm to the specified version
    RUN npm install -g npm@10.9.0
    
    # Verify Node.js and npm installation
    RUN node -v
    RUN npm -v
    
    # Set working directory
    WORKDIR /app
    
    # Copy package files and jest.setup.js first for better caching
    COPY package.json package-lock.json jest.setup.js ./
    
    # Install project dependencies with legacy peer dependencies to avoid conflicts
    RUN npm install --legacy-peer-deps
    
    # Copy the rest of the project files
    COPY . .
    
# ------------------------------
# Stage 2: Test - Run Jest Tests
# ------------------------------
FROM base AS test

# Set environment variable for testing
ENV NODE_ENV=test


# Run tests
CMD ["npm", "test"]

# ------------------------------
# Stage 3: Dependencies - Install Dependencies
# ------------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --legacy-peer-deps
    
# ------------------------------
# Stage 4: Production - Build the Production Image
# ------------------------------
FROM node:20-alpine AS production

# Install curl for healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Copy all dependencies from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Expose the desired port (ensure this matches your Express app configuration)
EXPOSE 5300

# Define the command to run your application
CMD ["node", "server"]