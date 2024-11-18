FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev

COPY ./dist ./

CMD ["npm", "run", "start:prod"]
