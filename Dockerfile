FROM node:16.10.0

RUN npm install -g npm@8.1.3
RUN npm i -g jest-cli@27.3.1

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
