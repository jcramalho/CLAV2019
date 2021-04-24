FROM nginx:1.19
COPY ./dist /app
#COPY nginx2.conf /etc/nginx/nginx.conf
#para usar o nginx como proxy
COPY nginxProxy.conf /etc/nginx/nginx.conf
