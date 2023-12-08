# Registration Web Page

## Using Docker

This project contains a `Dockerfile` as well as a `docker-compose.yml` to run it within a Docker container.

### Step 1 | Create configuration file

In the root directory, copy the content or rename `config.json.sample` to a file called `config.json`.
Then we need to modify the firebase connection info to match your personal Firebase app.
Insert the values for `apiKey` and `databaseURL` only.
The other values are not needed.

### Step 2 | Run the Docker scripts

To do so, call `docker-compose up` from the project's root. Once the image is built and the container running, you can access it via `http://localhost:8083` from your browser.

If port `8083` is already in use, change the port mapping in `docker-compose.yml`.

To force a re-build of the image. You may call `docker-compose build` before running or `docker-compose up --build` to force a re-build when running the container.

> If you don't have a SSL certificate installed on your local machine you might need to comment line 7 from the `.htaccess` file.
> `# RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R,L]`
