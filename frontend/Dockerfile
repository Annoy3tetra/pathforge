# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package config and lock files
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Pass build environment variables if needed
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage to nginx html path
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config for single page application (SPA) routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
