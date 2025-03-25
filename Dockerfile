# FROM node
# WORKDIR /app
# COPY . .
# COPY package.json /
# RUN npm install
# # COPY . /app
# CMD ["npm","start"]

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# RUN mkdir -p /app/db

COPY . .

EXPOSE 3000

CMD ["npm", "start"]