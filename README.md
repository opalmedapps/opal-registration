# Registration Web Page

## Using Docker

This project contains a `Dockerfile` as well as a `docker-compose.yml` to run it within a Docker container. To do so, call `docker-compose up` from the project's root. Once the image is built and the container running, you can access it via `http://localhost:8083` from your browser.

If port `8083` is already in use, change the port mapping in `docker-compose.yml`.

To force a re-build of the image. You may call `docker-compose build` before running or `docker-compose up --build` to force a re-build when running the container.
