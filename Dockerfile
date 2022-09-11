FROM node:16-alpine

WORKDIR /app

COPY package.json /app

RUN npm install --legacy-peer-deps

COPY . ./app

CMD [ "node", "server.js" ]

EXPOSE 5000

