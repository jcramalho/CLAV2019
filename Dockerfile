FROM node:14 
COPY ./ /app
WORKDIR /app
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
ARG VUE_APP_API_VERSION
ENV VUE_APP_API_VERSION=$VUE_APP_API_VERSION
ARG VUE_APP_INTERFACE_VERSION
ENV VUE_APP_INTERFACE_VERSION=$VUE_APP_INTERFACE_VERSION
RUN npm install
RUN npm audit fix --legacy-peer-deps
RUN npm run build

FROM nginx:1.19
RUN mkdir /app
COPY --from=0 /app/dist /app
