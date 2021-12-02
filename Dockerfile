FROM node:16 AS builder

WORKDIR /app

COPY ./src ./src
COPY *.json .

RUN npm install
RUN npm install pkg -g
RUN pkg .

FROM ubuntu:latest

WORKDIR /

ENV NODE_ENV=production

COPY --from=builder /app/dist/vup_monitors-linux /vup_monitors
RUN chmod +x /vup_monitors

VOLUME [ "/data" ]

ENTRYPOINT [ "/vup_monitors" ]