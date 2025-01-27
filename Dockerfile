# Step 1: Use an official Node.js runtime as the base image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json from the main directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the backend directory contents into the working directory
COPY backend ./backend

# Step 6: Set the working directory to the backend folder
WORKDIR /usr/src/app/backend

# Step 7: Expose the port your app runs on
# EXPOSE 3000

# Use environment variables to pass configuration (e.g., for MongoDB URI)
ENV NODE_ENV=production

# Step 8: Start the Node.js application
CMD ["node", "server.js"]