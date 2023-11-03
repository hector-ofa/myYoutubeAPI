# Use an official Node.js runtime as the base image
FROM node:14

# Create a working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port that your application will run on
EXPOSE 3000

# Define the command to start your application
CMD ["node", "app.js"]