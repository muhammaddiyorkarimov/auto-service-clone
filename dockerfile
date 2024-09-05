

FROM node:20-alpine

WORKDIR /app

copy package*.json .

RUN npm install

COPY . .
 
EXPOSE 8001

CMD ["npm","run","dev"]