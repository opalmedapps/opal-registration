# Note: this file is set up for development use. For production builds and deployment, see .gitlab-ci.yml
FROM node:20.11.1-alpine3.19 as dependencies

WORKDIR /app

# install modules
# allow to cache by not copying the whole application code in (yet)
# see: https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile

COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

RUN npm ci


FROM node:20.11.1-alpine3.19

# Parent needs to be owned by www-data to satisfy npm
# RUN chown -R www-data:www-data /var/www/
COPY --from=dependencies --chown=www-data:www-data /app/node_modules ./node_modules

# Copy source code
COPY --chown=www-data:www-data . .
