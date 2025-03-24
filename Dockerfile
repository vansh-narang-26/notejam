FROM node
WORKDIR /app
COPY . .
COPY package.json /
RUN npm install
# COPY . /app
CMD ["DEBUG=* ./bin/www"]