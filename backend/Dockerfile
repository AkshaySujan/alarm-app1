FROM node:20-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

RUN npm ci --omit=dev

# Copy the rest of the backend code
COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]
