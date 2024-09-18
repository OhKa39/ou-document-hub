# Stage 1: Build 
FROM maven:3.9.9-amazoncorretto-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src /app/src
RUN mvn package -DskipTests

# Stage 2: Runtime prod
FROM openjdk:21-jdk AS runtime
WORKDIR /app
COPY --from=builder /app/target/*.jar /app/
CMD ["java", "-jar", "oudocumenthub-backend.jar"]
