# Stage 1: Build
FROM maven:3.8.6-jdk-11 AS build
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn package -DskipTests

# Stage 2: Runtime
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar /app/
CMD ["java", "-jar", "your-app.jar"]
