FROM node:25.2.1-alpine3.22
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app