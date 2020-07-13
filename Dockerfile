FROM node:14.5
COPY ./ /app
WORKDIR /app
RUN npm install && npm audit fix && npm run build

FROM nginx:1.19
RUN mkdir /app
COPY --from=0 /app/dist /app
#COPY nginx2.conf /etc/nginx/nginx.conf
#para usar o nginx como proxy
COPY nginxProxy.conf /etc/nginx/nginx.conf
