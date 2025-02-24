# # Use Maven image to build the JAR
# FROM maven:3.9.6-amazoncorretto-21 AS builder
# WORKDIR /app
# COPY pom.xml .
# COPY src ./src
# RUN mvn -B package --file pom.xml

# # Use a lightweight JDK runtime
# FROM amazoncorretto:21-alpine-jdk
# WORKDIR /app
# COPY --from=builder /app/target/api-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 8080
# CMD ["java", "-jar", "app.jar"]


# Build JAR with Maven
FROM maven:3.9.6-amazoncorretto-21 AS builder
WORKDIR /app
COPY . .
RUN mvn -B package --file pom.xml

# Check the generated files in the builder stage
RUN ls -l /app/target  # This helps us verify the JAR file exists

# Use lightweight JDK runtime for the final image
FROM amazoncorretto:21-alpine-jdk
WORKDIR /app

# Copy the JAR from the builder stage
COPY --from=builder /app/target/volodb-0.0.1.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
