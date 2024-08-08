FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm run build

COPY . . 

EXPOSE 3005
CMD ["npm", "start"]

