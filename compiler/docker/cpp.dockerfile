FROM gcc:latest
WORKDIR /app

# Copy all files from build context
COPY . .

# Compile the C++ program
RUN g++ main.cpp -o main && chmod +x main

# Debug: List files to verify compilation
RUN ls -la

# Run the program with input redirection
CMD ["sh", "-c", "if [ -f input.txt ]; then ./main < input.txt; else echo '' | ./main; fi"]