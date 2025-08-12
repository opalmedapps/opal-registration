<!--
SPDX-FileCopyrightText: Copyright (C) 2021 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Registration Web Page

## Setup

This project contains a `Dockerfile` as well as a `docker-compose.yml` file to run it as a container.

### Step 1: Create configuration file

In the root directory, copy `config.json.sample` to `config.json`.
Then add the values for `apiKey` and `databaseURL` to that of your Firebase project.

### Step 2: Add the `.npmrc` file (Optional)

This project uses [AngularJS](https://angularjs.org/) which reached end of life in January 2022.
This project uses a long-term support version of AngularJS provided by [HeroDevs](https://www.herodevs.com/support/nes-angularjs).
If you have an `npm` token to retrieve this version from their registry, place the `.npmrc` file containing the credentials in the root directory.

You can also use the [last available version](https://www.npmjs.com/package/angular) of AngularJS (version 1.8.3).
To do so, change the value for the `angular` dependency in `package.json` to `angular@1.8.3` and run `npm install` to update the lock file.

### Step 3: Start the container

```shell
docker compose up
```

This builds the image (if necessary) and brings up the container.

You can access the web page at `http://localhost:8083` with your browser.
