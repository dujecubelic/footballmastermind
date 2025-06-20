# Stage 1: Build with Maven
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy only backend folder
COPY backend /build

# Build the app
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy built jar from builder
COPY --from=builder /build/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]

