FROM node:16-alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD node server.js
