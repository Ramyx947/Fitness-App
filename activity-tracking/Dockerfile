# Set up to run GitHub Workflow on local
# Use the official Ubuntu 20.04 as the base image
FROM ubuntu:20.04

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

# Update npm to the latest version
RUN npm install -g npm@10.9.0

# Verify Node.js and npm installation
RUN node -v
RUN npm -v

# Set working directory
WORKDIR /app

# Copy package files and jest.setup.js first
COPY package.json package-lock.json jest.setup.js ./

# Install project dependencies with legacy peer dependencies to avoid conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Run tests
CMD ["npm", "test"]