FROM node:26
WORKDIR /usr/src/app

# Dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

EXPOSE 80
CMD ["npm", "start"]