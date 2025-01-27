# Step 1: Use the official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json from the root directory (not backend)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the backend code into the container
COPY backend/ ./backend/

# Step 6: Expose the port the app will run on
EXPOSE 3000

# Step 7: Command to run the application using nodemon
CMD ["npm", "run", "dev"]