FROM openjdk:17
WORKDIR /app
COPY . .
RUN javac Main.java
CMD ["sh", "-c", "java Main < input.txt"]
