FROM node:16.16.0

RUN npm install -g npm@9.1.2

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
