FROM node:16.16.0

RUN npm install -g npm@8.19.2

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
