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
# replace backend-specific copies with context-local copies
(Get-Content backend/Dockerfile -Raw) `
  -replace 'COPY backend/package\*\.json ./', 'COPY package*.json ./' `
  -replace 'COPY backend/ ./', 'COPY . ./' `
  | Set-Content backend/Dockerfile -Encoding UTF8

