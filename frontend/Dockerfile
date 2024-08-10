FROM node:22.6.0-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 
RUN npm run build
RUN chmod -R 777 .next

EXPOSE 3005
CMD ["npm", "start"]
