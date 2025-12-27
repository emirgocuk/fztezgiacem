
# Stage 1: Build Astro Site
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Copy built artifacts from Stage 1
COPY --from=builder /app/dist /srv

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Expose port (Internal Caddy port, mapped by Compose)
EXPOSE 80
