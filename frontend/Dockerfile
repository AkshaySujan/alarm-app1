# frontend/Dockerfile
# Build static Vite app and serve with nginx
### Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

### Production stage - nginx
FROM nginx:alpine AS production
# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# replace frontend-specific copies with context-local copies
(Get-Content frontend/Dockerfile -Raw) `
  -replace 'COPY frontend/package\*\.json ./', 'COPY package*.json ./' `
  -replace 'COPY frontend/ ./', 'COPY . ./' `
  | Set-Content frontend/Dockerfile -Encoding UTF8
