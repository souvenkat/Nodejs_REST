# Stage 1: Build
FROM node:22 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Stage 2: Production
FROM node:22-slim

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build /usr/src/app ./

# Expose the application port
EXPOSE 4000

# Command to start the application
CMD ["node", "index.js"]
