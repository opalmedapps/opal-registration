# SPDX-FileCopyrightText: Copyright (C) 2021 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
#
# SPDX-License-Identifier: AGPL-3.0-or-later

# Note: this file is set up for local development only. For builds deployed to our Opal environments, see .gitlab-ci.yml
FROM node:22.16.0-alpine3.21 AS dependencies

WORKDIR /app

# install modules
# allow to cache by not copying the whole application code in (yet)
# see: https://stackoverflow.com/questions/35774714/how-to-cache-the-run-npm-install-instruction-when-docker-build-a-dockerfile

COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

RUN npm ci


FROM node:22.16.0-alpine3.21

WORKDIR /app

# Parent needs to be owned by www-data to satisfy npm
COPY --from=dependencies --chown=www-data:www-data /app/node_modules /node_modules
