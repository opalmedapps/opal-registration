FROM node:16.14.0-alpine3.14 as dependencies

# Install dependencies for bower
RUN apk add --no-cache git

RUN npm install -g bower

WORKDIR /app

# install modules
# allow to cache by not copying the whole application code in (yet)
# see: https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile
COPY bower.json ./
RUN bower --allow-root install

COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./
RUN npm ci


FROM php:8.0.16-apache-bullseye

# Install dependencies
RUN apt-get update \
  # libxml for php-soap
  && apt-get install -y libxml2-dev \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

# Enable mod_headers
RUN a2enmod headers
# Enable mod_rewrite
RUN a2enmod rewrite

USER www-data

# Parent needs to be owned by www-data to satisfy npm
# RUN chown -R www-data:www-data /var/www/
COPY --from=dependencies --chown=www-data:www-data /app/bower_components ./bower_components
COPY --from=dependencies --chown=www-data:www-data /app/node_modules ./node_modules

COPY --chown=www-data:www-data . .
