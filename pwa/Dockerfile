FROM node:18-alpine

# Set working directory
WORKDIR /app/pwa

# Copy project files (optional, useful for local development)
COPY . .
RUN npm install

# Start the Nuxt app
CMD ["npm", "run", "dev"]
