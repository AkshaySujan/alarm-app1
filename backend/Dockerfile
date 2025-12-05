# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# copy only package files first (layer caching)
COPY backend/package*.json ./
RUN npm ci --omit=dev

# copy source
COPY backend/ ./

# expose port (match your server)
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
