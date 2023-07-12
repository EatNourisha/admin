FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=builder /app/dist .

EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]
