FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g tsx

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]