
FROM node:18

LABEL maintainer="SWE 574 - Fall 2023 - Group 1"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
