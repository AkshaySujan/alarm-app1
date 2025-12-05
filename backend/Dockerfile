# Backend Dockerfile - simple, correct, production-friendly
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy only package files first for better cache
COPY backend/package*.json ./

# install only production deps (dev omitted)
RUN npm ci --omit=dev

# copy the rest of the backend source
COPY backend/ ./

# expose port (container listens on 4000 inside)
EXPOSE 4000

# start the app
CMD [ "node", "src/index.js" ]
