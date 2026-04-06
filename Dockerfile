FROM node:22-alpine AS build
WORKDIR /workspace/rocket-alpha-ui

COPY --from=shared_ui / ./

WORKDIR /workspace/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
