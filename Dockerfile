FROM node:13.14 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8080

CMD [ "node","./dist/src/index.js" ]