# Multi-stage build for both frontend and backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend package files
COPY package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY . .

# Build frontend for static export
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.4-eclipse-temurin-17 AS backend-builder

WORKDIR /backend

# Copy backend source
COPY backend/ ./

# Create static resources directory and copy frontend build
RUN mkdir -p src/main/resources/static
COPY --from=frontend-builder /frontend/out/* src/main/resources/static/

# Build Spring Boot application
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from backend builder
COPY --from=backend-builder /backend/target/*.jar app.jar

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

