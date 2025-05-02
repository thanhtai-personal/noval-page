FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Cài serve để chạy frontend
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3001"]
