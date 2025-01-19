Troubleshooting Nginx Reverse Proxy Integration

## Table of Contents

- [Overview](#overview)
- [Step-by-Step Debugging](#step-by-step-debugging)
   - [Verify Docker Network](#1-verify-docker-network)
   - [Validate Nginx Configuration](#2-validate-nginx-configuration)
   - [Test Upstream Services](#3-test-upstream-services)
   - [Check Service Health](#4-check-service-health)
   - [Validate Environment Variables](#5-validate-environment-variables)
   - [Inspect Logs](#6-inspect-logs)
   - [Rebuild and Restart Services](#7-rebuild-and-restart-services)
- [Advanced Debugging Tips](#advanced-debugging-tips)
- [Common Commands Reference](#common-commands-reference)

### Overview

This document outlines common issues and solutions for debugging Nginx reverse proxy integration in a microservices architecture. Use this as a checklist when diagnosing issues.

### Step-by-Step Debugging

#### 1. Verify Docker Network

1. Check that all services are connected to the `app-network`:
   ```sh
   docker network inspect app-network
   ```
2. Ensure all services are listed under `Containers` in the output.
- If containers are missing, reconnect them:
```sh
docker network connect app-network <container_name>
```
- Restart containers if necessary:
```sh
docker-compose down && docker-compose up -d
```

#### 2. Validate Nginx Configuration

1. Test the Nginx configuration syntax:
   ```sh
   docker exec -it <nginx-container-name> nginx -t
   ```
2. If errors are found, correct `nginx.conf` and reload:
   ```sh
   docker exec -it <nginx-container-name> nginx -s reload
   ```

#### 3. Test Upstream Services

1. Use `curl` to test upstream service endpoints directly from within the Nginx container:
   ```sh
   docker exec -it <nginx-container-name> curl http://activity-tracking:5300/exercises
   ```
2. If the service is unreachable, check its logs and health status:
   ```sh
   docker logs activity-tracking
   ```

#### 4. Check Service Health

1. Confirm all services are healthy using `docker-compose ps`.
2. Inspect health check logs:
   ```sh
   docker-compose logs authservice
   ```

#### 5. Validate Environment Variables

1. Confirm `.env` file values are loaded correctly:
   ```sh
   docker exec -it frontend env | grep REACT_APP
   ```
2. Ensure URLs are correctly set, e.g., `REACT_APP_ACTIVITY_URL=/api/activity`.

#### 6. Inspect Logs

1. View logs for specific services:
   ```sh
   docker-compose logs nginx
   docker-compose logs activity-tracking
   ```
2. Check for errors or warnings related to connectivity or configuration.

#### 7. Rebuild and Restart Services

1. Rebuild services to apply configuration changes:
   ```sh
   docker-compose down --remove-orphans
   docker-compose up --build
   ```
2. Restart specific services if needed:
   ```sh
   docker-compose restart nginx
   ```

[Back to Table of Contents](#table-of-contents)

### **Advanced Debugging Tips**

#### 1. Test APIs with Curl

Replace the API endpoint and payload as needed:

```sh
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

#### 2. Check DNS Resolution

1. Enter the Nginx container:
   ```sh
   docker exec -it nginx sh
   ```
2. Test DNS resolution for upstream services:
   ```sh
   nslookup activity-tracking
   ```

#### 3. Monitor Real-Time Logs

View logs in real time for debugging:

```sh
docker-compose logs -f nginx
```

#### 4. Clear Cache

Clear static file cache to ensure updates are reflected:

```sh
docker exec -it nginx rm -rf /var/cache/nginx/*
```
[Back to Table of Contents](#table-of-contents)

### Common Commands Reference

#### Docker Commands

```sh
# Stop and remove containers
docker-compose down --remove-orphans

# Start containers
docker-compose up --build

# View logs
docker-compose logs nginx

docker-compose logs <service_name>

# Inspect Docker network
docker network inspect app-network
```
Nginx Commands
```sh
# Test Nginx configuration
nginx -t

# Reload Nginx
nginx -s reload

# View Nginx logs
cat /var/log/nginx/error.log
```

[Back to Table of Contents](#table-of-contents)