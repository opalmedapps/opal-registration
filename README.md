# Registration Web Page

## Setup

This project contains a `Dockerfile` as well as a `docker-compose.yml` file to run it as a container.

### Step 1: Create configuration file

In the root directory, copy `config.json.sample` to `config.json`.
Then add the values for `apiKey` and `databaseURL` to that of your Firebase project.

### Step 2: Start the container

```shell
docker compose up
```

This builds the image (if necessary) and brings up the container.Y

You can access the web page at `http://localhost:8083` with your browser.
