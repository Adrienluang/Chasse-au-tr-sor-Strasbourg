# Stage 1 : Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NUXT_PUBLIC_GRAPHHOPPER_API_KEY
ENV NUXT_PUBLIC_GRAPHHOPPER_API_KEY=${NUXT_PUBLIC_GRAPHHOPPER_API_KEY}

RUN npm run generate

# Stage 2 : Serve
FROM nginx:alpine

COPY --from=build /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
