# ----------
# Using a multi-stage build to separate dependencies from the application code
# ----------

# First stage: Install dependencies
FROM node:14 AS dependencies
WORKDIR /app

# Copy package.json and package-lock.json separately to allow Docker to cache npm install if dependencies haven't changed
COPY package*.json ./
RUN npm install

# Second stage: Build the application with dependencies
FROM node:14
WORKDIR /app

# Copy only the built node_modules from the first stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY . .

EXPOSE 5300
CMD ["node", "server"]
