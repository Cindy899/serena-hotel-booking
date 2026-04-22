# Dockerfile
# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (best practice for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "src/app.js"]