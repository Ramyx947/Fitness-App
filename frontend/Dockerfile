# ----------
# Using a multi-stage build to separate dependencies from the application code
# ----------

# First stage: Install dependencies and build the React app
FROM node:18.18.0 AS build
WORKDIR /app

# Copy only the package.json and package-lock.json for dependency caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Second stage: Serve the static files with NGINX
FROM nginx:alpine
# Copy the build files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Add custom Nginx configuration for SPA routing
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]