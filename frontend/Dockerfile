FROM node:22.6.0-alpine3.19

WORKDIR /app
RUN chown -R 1000:1000 /app
USER 1000:1000

RUN mkdir coverage && mkdir test-report
RUN chmod 777 coverage && chmod 777 test-report

COPY --chown=1000:1000 package*.json ./
RUN npm install

COPY --chown=1000:1000 . . 
RUN npm run build

EXPOSE 3005
CMD ["npm", "start"]
