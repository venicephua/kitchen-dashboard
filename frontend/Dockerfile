# Use Node.js 18 LTS as base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (use install instead of ci to handle package changes)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# List contents to debug
RUN ls -la /app
RUN ls -la /app/build || echo "build directory not found"

# Production stage
FROM nginx:alpine AS runner

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 3001;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Disable access logging
    access_log off;
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Expose port 3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
