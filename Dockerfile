# Use Node.js 22-slim image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package, lock file & prisma folder
COPY package.json prisma ./ 

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Generate prisma
RUN npx prisma generate

# Expose the port
EXPOSE 8080

# Run in dev mode (hot-reload via volumes)
CMD ["npm", "run", "start:dev"]