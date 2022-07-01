FROM node:18.3.0

RUN npm install -g npm@8.13.2

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
