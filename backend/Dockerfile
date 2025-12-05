FROM node:20-alpine

WORKDIR /app

# Install dependencies first
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

EXPOSE 4000

CMD ["node", "src/index.js"]
