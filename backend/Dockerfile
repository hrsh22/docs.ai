# Use Node.js LTS version as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and configuration files
COPY . .

# Build TypeScript code
RUN npm run build

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"] 