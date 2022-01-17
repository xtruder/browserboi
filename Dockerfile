FROM node:16 as builder

WORKDIR /app
ADD package.json package-lock.json /app/

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install

ADD . /app
RUN npm run build

FROM node:16

RUN apt-get update \
     && apt-get install -y wget gnupg ca-certificates dumb-init \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json /app/
COPY bin /app/bin
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install --production && npm install -g

COPY --from=builder /app/dist /app/dist

RUN groupadd -r runner && useradd -r -g runner -G audio,video -m -d /home/runner runner
USER runner

ENV BROWSERBOI_CHROME_PATH=google-chrome-stable
ENTRYPOINT ["/usr/bin/dumb-init", "--", "browserboi"]
