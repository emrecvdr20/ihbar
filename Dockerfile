# Dockerfile (Backend - Spring Boot)
FROM eclipse-temurin:21-jdk-slim

WORKDIR /app

# Copy Maven files
COPY pom.xml .
COPY src ./src

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build application
RUN mvn clean package -DskipTests

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Run application
CMD ["java", "-jar", "target/fire-watch-0.0.1-SNAPSHOT.jar"]