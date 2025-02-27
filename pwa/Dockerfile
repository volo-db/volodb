FROM node:18-alpine

# Set working directory
WORKDIR /app/pwa

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Ensure node_modules/.bin is in PATH
ENV PATH /app/pwa/node_modules/.bin:$PATH

# Start the Nuxt app
CMD ["npm", "run", "dev"]
