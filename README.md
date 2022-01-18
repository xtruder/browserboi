# browserboi

Headless browser automation service for things that we can't do with official APIs

## Services

### Youtube

**Supported actions**

- like youtube video
- add youtube video to watch later playlist

**Setup**

First you will need to obtain google cookies by running

```
browserboi login-youtube --output cookies.json
```

## Running

```
browserboi serve --headless --youtube-cookies cookies.json --token <optional auto token>
```

Starts a headless API on `localhost:8080` protected by bearer auth with provided token

### Calling API

```bash
curl -XPOST localhost:8080/api/youtube/watchLater \
  -H 'Authorization: Bearer <auth token>'
  -d '{"url": "https://www.youtube.com/watch?v=gCJxvpo0dxY", "added": true}'
```

## Development

```
npm install
npm run dev
```

This will start a development server on `localhost:8080`

### VsCode remote container

This project already provides vscode development container that will start
wayland rdp server, to which you can connect and visually debug your automation.

To connect to rdp server you need to first expose port 3389 from container usng vscode
and then use any rdp client to connect to it.

## Author

Jaka Hudoklin <jaka@x-truder.net> [@offlinehacker](twitter.com/offlinehacker)
