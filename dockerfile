# Stage 1: Build React app
FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Expose the port that Nginx will run on
EXPOSE 3000

# Start Nginx
CMD ["npm", "run", "dev"]
