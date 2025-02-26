FROM node:18-alpine

# Set working directory
WORKDIR /app/pwa

# Copy project files (optional, useful for local development)
COPY . .

# Clean up any leftover socket files on container start
RUN rm -rf /tmp/nitro

RUN npm install

# Start the Nuxt app
CMD ["npm", "run", "dev"]
