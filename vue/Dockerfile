FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./my-project/package*.json ./
RUN npm install
COPY ./my-project .
RUN npm run serve
