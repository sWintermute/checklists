# Stage 1 - build frontend app
FROM node:14.2.0-alpine3.11 as build-deps

WORKDIR /app/

COPY frontend/package.json frontend/package-lock.json /app/
RUN npm install

COPY frontend /app/
COPY .env /app/.env
RUN npm run build

# Stage 2 - nginx & frontend dist
FROM nginx:1.21.0-alpine

COPY nginx/prod.conf /etc/nginx/nginx.conf
COPY --from=build-deps /app/dist/ /app/

CMD ["nginx", "-g", "daemon off;"]
