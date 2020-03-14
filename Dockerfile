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
