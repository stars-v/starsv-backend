FROM node:16

WORKDIR /app

COPY package*.json ./


RUN yarn
# RUN npm install --legacy-peer-deps
# RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD [ "node", "server.js" ]
