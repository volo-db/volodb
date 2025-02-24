FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies and create new Nuxt app
RUN npx nuxi@latest init pwa && \
    cd pwa && \
    npm install

# Change to project directory
WORKDIR /app/pwa

# Copy project files (optional, useful for local development)
COPY . .

# Expose Nuxt default port
EXPOSE 3000

# Start the Nuxt app
CMD ["npm", "run", "dev"]
