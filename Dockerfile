FROM node:16-buster-slim
ENV PORT 3200

WORKDIR /app
COPY ./src/package.json /app/
COPY ./src/server.js /app/

RUN npm install

EXPOSE ${PORT}
CMD [ "npm", "start" ]