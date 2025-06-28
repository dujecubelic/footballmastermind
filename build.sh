#!/bin/bash

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to Spring Boot static resources
mkdir -p backend/src/main/resources/static
cp -r frontend/out/* backend/src/main/resources/static/

# Build backend
cd backend
mvn clean package -DskipTests