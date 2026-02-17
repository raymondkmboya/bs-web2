# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.25-alpine as production-stage

# Copy built assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for CapRover
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
