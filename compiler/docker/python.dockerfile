FROM python:3.10-slim
WORKDIR /app
COPY . .
CMD ["sh", "-c", "python3 main.py < input.txt"]
