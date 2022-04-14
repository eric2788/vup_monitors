FROM node:16-alpine

WORKDIR /app

COPY ./src ./src
COPY *.json .

RUN npm install

VOLUME [ "/app/data"，"/app/caches" ]

CMD [ "npm", "run", "start" ]