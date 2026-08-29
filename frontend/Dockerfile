# =====================================================================
# Stage 1: Build Frontend Assets with Node.js
# =====================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source files and configuration
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
COPY src/ ./src/
COPY tests/ ./tests/

# Build static bundle for production
RUN npm run build

# =====================================================================
# Stage 2: Serve Static Assets with High-Performance Nginx
# =====================================================================
FROM nginx:alpine AS runner

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose frontend container port
EXPOSE 3000

# Healthcheck for static frontend server
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
