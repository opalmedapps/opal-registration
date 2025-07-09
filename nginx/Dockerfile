FROM nginx:1.23-alpine
ARG NGINX_CONF

RUN rm /etc/nginx/conf.d/default.conf
COPY ./${NGINX_CONF} /etc/nginx/conf.d
