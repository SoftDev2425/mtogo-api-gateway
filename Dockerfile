FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY ./src/swagger ./dist/swagger
COPY ./dist ./

CMD ["npm", "run", "start:prod"]
