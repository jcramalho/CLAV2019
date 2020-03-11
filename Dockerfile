FROM node:10
COPY ./ /app
WORKDIR /app
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
ARG VUE_APP_API_VERSION
ENV VUE_APP_API_VERSION=$VUE_APP_API_VERSION
RUN npm install
RUN npm audit fix
RUN npm run build

FROM nginx
RUN mkdir /app
COPY --from=0 /app/dist /app
#Porta 7779 HTTP e 7780 HTTPS
#COPY nginx.conf /etc/nginx/nginx.conf
#Porta 7776 HTTP e 7777 HTTPS
#COPY nginx2.conf /etc/nginx/nginx.conf
#para usar o nginx como proxy, Porta 7776 HTTP e 7777 HTTPS
COPY nginxProxy.conf /etc/nginx/nginx.conf

COPY prepareHTTPS.sh /app
RUN mkdir -p /etc/nginx/acme.sh

#gen a self-signed certificate only to boot nginx
RUN apt-get update && \
    apt-get install -y openssl sudo
RUN openssl req -batch -sha256 -x509 -nodes -days 1 -subj "/C=PT/ST=Denial/L=Portugal/O=CLAV/CN=localhost" -newkey rsa:2048 -keyout /etc/nginx/acme.sh/key.pem -out /etc/nginx/acme.sh/fullchain.pem

#gen dhparam example, only to boot nginx
RUN openssl dhparam -out /etc/nginx/acme.sh/dhparam.pem 1024

CMD sh -c '(nginx -g "daemon off;" &) && /app/prepareHTTPS.sh && tail -f /dev/null'
