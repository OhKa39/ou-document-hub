# Stage 1: Build for dev
FROM maven:3.9.9-amazoncorretto-21 AS build-dev
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn package

# Stage 2: Build for prod
FROM maven:3.9.9-amazoncorretto-21 AS build-prod
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn package -DskipTests

# Stage 3: Runtime prod
FROM openjdk:21-jdk as runtime
WORKDIR /app
COPY --from=build /app/target/*.jar /app/
CMD ["java", "-jar", "your-app.jar"]
