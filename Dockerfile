FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=builder /app/dist .

EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]
