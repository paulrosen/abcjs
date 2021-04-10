FROM node:15.14

RUN npm install -g npm@7.9.0
RUN npm i -g jest-cli

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
