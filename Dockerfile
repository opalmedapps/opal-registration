FROM node:20.11.0-alpine3.19 as dependencies

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}"

WORKDIR /app

# install modules
# allow to cache by not copying the whole application code in (yet)
# see: https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile

COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

# Installs only production dependencies when NODE_ENV is set to "production"
# see: https://docs.npmjs.com/cli/v9/commands/npm-ci#omit
RUN npm ci


FROM php:8.3.3-apache-bookworm

# Install dependencies
RUN apt-get update \
  # libxml for php-soap
  && apt-get install -y libxml2-dev \
  # cleaning up unused files
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

# Enable mod_headers
RUN a2enmod headers \
  # Enable mod_rewrite
  && a2enmod rewrite

USER www-data
WORKDIR /var/www/html

# Parent needs to be owned by www-data to satisfy npm
# RUN chown -R www-data:www-data /var/www/
COPY --from=dependencies --chown=www-data:www-data /app/node_modules ./node_modules

COPY --chown=www-data:www-data . .
