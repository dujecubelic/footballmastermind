# Multi-stage build for both frontend and backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files from the frontend folder
COPY frontend/package*.json ./

# Install all dependencies
RUN npm install

# Copy all frontend source code from the frontend folder
COPY frontend/ .

# Build frontend for static export
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.4-eclipse-temurin-17 AS backend-builder

WORKDIR /backend

# Copy backend source
COPY backend/ ./

# Create static resources directory and copy ALL frontend build files
RUN mkdir -p src/main/resources/static

# Copy the entire out directory (includes _next/static and all assets)
COPY --from=frontend-builder /app/out/ src/main/resources/static/

# Build Spring Boot application
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy the built jar from backend builder
COPY --from=backend-builder /backend/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
