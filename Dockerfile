FROM node:14.20 as build
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000

CMD [ "npm","start" ]