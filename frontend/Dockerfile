FROM node:22.6.0-alpine3.19

WORKDIR /app
RUN chown -R node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . . 
RUN npm run build

EXPOSE 3005
CMD ["npm", "start"]

