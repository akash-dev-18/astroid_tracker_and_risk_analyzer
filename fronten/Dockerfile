# Frontend Dockerfile - Simple & Reliable
# 1. Build Stage
FROM node:20-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install

# Accept build argument for API URL
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN npm run build

# 2. Serve Stage
FROM node:20-alpine
WORKDIR /app

# Install 'serve' package globally
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

# Expose port 80
EXPOSE 80

# Serve the 'dist' folder on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
