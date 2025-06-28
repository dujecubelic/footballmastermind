# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install all dependencies (use npm install since no package-lock.json exists)
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the frontend
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.4-eclipse-temurin-17 AS backend-builder

WORKDIR /backend

# Copy backend files
COPY backend/ ./

# Build the backend
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built jar from backend builder
COPY --from=backend-builder /backend/target/*.jar app.jar

# Copy built frontend from frontend builder to Spring Boot static resources
COPY --from=frontend-builder /app/out/ /app/static/

# Create the static resources directory in the jar location
RUN mkdir -p /app/src/main/resources/static
COPY --from=frontend-builder /app/out/ /app/src/main/resources/static/

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
