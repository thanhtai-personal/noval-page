# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files & install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. Build NestJS project
RUN npm run build

# 6. Run the app
CMD ["node", "dist/main"]
