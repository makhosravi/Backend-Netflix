# Step 1: Use the official Node.js image as the base image
FROM node:16

# Step 2: Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json from the root directory (not backend)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --no-optional

# Step 5: Copy the rest of the backend code into the container
COPY backend/ ./backend/

# Set correct permissions (optional, but can help avoid permission issues)
# Copy wait script and make it executable
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh && chmod -R 755 ./backend

# Expose ports: 4000 for backend
EXPOSE 4000

# Set environment
ENV NODE_ENV=development

# Step 7: Command to run the application using nodemon
CMD ["npm", "run", "dev"]
#"./wait-for-it.sh", "mongo:27030", "--timeout=30", "--", 