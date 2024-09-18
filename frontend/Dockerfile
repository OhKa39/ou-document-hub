# Stage 1: Build base
FROM node:22.6.0-alpine3.19 AS base
LABEL author="ohka39 <lythanhkhoa360@gmail.com>"

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Stage 2: Build image
FROM node:22.6.0-alpine3.19 AS builder
LABEL author="ohka39 <lythanhkhoa360@gmailcom>"

WORKDIR /app

# ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm i sharp

COPY --from=base /app/node_modules ./node_modules
COPY . . 

RUN npm run build 


#Stage 3: Run image
FROM node:22.6.0-alpine3.19 AS runner
LABEL author="ohka39 <lythanhkhoa360@gmail.com>"

WORKDIR /app

USER node

ENV NODE_ENV="production"

COPY --from=builder --chown=node:node /app/next.config.js ./
COPY --from=builder --chown=node:node /app/public ./public

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3002
ENV PORT 3002

CMD ["node", "server.js"]
