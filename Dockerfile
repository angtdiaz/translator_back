FROM node:13.14 as build
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080

CMD [ "node","src/index.js" ]