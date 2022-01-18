# browserboi :computer: :boy:

Headless browser automation service for things that we can't do with official APIs. Uses puppeter and chrome for browser automation.

## About

**Browserboi** is a service that provides browser automation
using [puppeteer](https://github.com/puppeteer/puppeteer) and
exposes http API for various tasks that are not exposed via
official apis.

### List of implemented automations

- like youtube videos
- add youtube videos to watch later list

## Usage

You can install package via npm or use a docker image

### Dependencies

- nodejs >=16
- google chrome or chromium

### Installing package

```bash
npm install -g @xtruder/browserboi
```

### Running

```bash
browserboi serve --headless --youtube-cookies cookies.json
```

This will Start a http API on `localhost:8080`.

To obtain `cookies.json` you should run:

```bash
browserboi login-youtube --chrome-path chromium --output cookies.json
```

This will open chromium with google login screen, after you login it will dump cookies to `cookies.json`, which you can start a service.

### Using docker image

```bash
docker run \
  -e BROWSERBOI_HEADLESS=true \
  -e BROWSERBOI_YOUTUBE_COOKIES=/app/cookies.json \
  -e BROWSERBOI_TOKEN=<my secret bearer token> \
  -p 8080:8080 \
  -v $PWD/cookies.json:/app/cookies.json \
  ghcr.io/xtruder/browserboi:latest serve
```

### API

Swagger API documentation is avalible on http://localhost:8080/docs.

**Example API calls:**

Adds youtube video to watch later list:

```bash
curl -XPOST localhost:8080/api/youtube/watchLater \
  -H 'Authorization: Bearer <auth token>'
  -d '{"url": "https://www.youtube.com/watch?v=gCJxvpo0dxY", "added": true}'
```

Like youtube video:

```bash
curl -XPOST localhost:8080/api/youtube/likeVideo \
  -H 'Authorization: Bearer <auth token>'
  -d '{"url": "https://www.youtube.com/watch?v=gCJxvpo0dxY", "liked": true}'
```

## Development

- Install google chrome or chromium

- Clone and install dependencies

    ```bash
    git clone https://github.com/xtruder/browserboi.git
    npm install
    ```

- Obtain youtube access tokens

    ```
    browserboi login-youtube --chrome-path chromium --output cookies.json
    ```

-  `npm run dev`

    This will start a chrome and development server on `localhost:8080`

### VsCode remote container

This project already provides vscode development container that will start
wayland rdp server, to which you can connect and visually debug your automation.

To connect to rdp server you need to first expose port 3389 from container usng vscode
and then use any rdp client to connect to it.

### Publish a new package

1. Bump a version

```bash
npm version <major/minor/patch/>
git push origin --tags
```

2. Release a new version via github

## Author

Jaka Hudoklin <jaka@x-truder.net> [@offlinehacker](twitter.com/offlinehacker)
