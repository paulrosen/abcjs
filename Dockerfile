FROM node

RUN npm i -g jest-cli

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app
