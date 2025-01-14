# Use an official Maven image with OpenJDK 21 as the base image for building the application
FROM maven:3.9.8-eclipse-temurin-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and the src folder into the container(to take advantage of Docker cache during builds) and install dependencies
COPY pom.xml .

# Download and install dependencies (this step ensures that dependencies are cached if pom.xml hasn't changed)
RUN mvn dependency:go-offline

# Copy the src folder into the container
COPY src ./src

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Use OpenJDK 21 runtime for the final image
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the jar file built in the previous stage into the container and copy the jar file name
COPY --from=build /app/target/email-writer-sb-0.0.1-SNAPSHOT.jar .

# Expose the port the app runs on
EXPOSE 8080

# Run the jar file, Specify the command to run the application with copied jar file name
ENTRYPOINT ["java", "-jar", "/app/email-writer-sb-0.0.1-SNAPSHOT.jar"]