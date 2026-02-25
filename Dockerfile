# SPDX-FileCopyrightText: Copyright (C) 2021 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

# Note: this file is set up for local development only. For builds deployed to our Opal environments, see .gitlab-ci.yml
FROM node:24.14.0-alpine3.23 AS dependencies

WORKDIR /app

# install modules
# allow to cache by not copying the whole application code in (yet)
# see: https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile

COPY package.json ./
COPY package-lock.json ./

# uncomment the line below if you have an npm token
# COPY .npmrc ./

RUN npm ci


FROM node:24.14.0-alpine3.23

WORKDIR /app

# Parent needs to be owned by www-data to satisfy npm
COPY --from=dependencies --chown=www-data:www-data /app/node_modules /node_modules
