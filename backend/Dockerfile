# ─── Build stage ──────────────────────────────────────────────
FROM maven:4.0.0-rc-5-eclipse-temurin AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests 2>&1

# ─── Run stage ────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]