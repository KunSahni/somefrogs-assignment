# Use a base image with the necessary dependencies
FROM node:20.11.0

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a build of the application
RUN npm run build

# Expose the port your backend is running on
EXPOSE 4173

# Command to run your application
CMD ["npm", "run", "preview"]
