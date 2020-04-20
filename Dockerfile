FROM node

RUN mkdir /srv/app && chown node:node /srv/app

USER node

WORKDIR /srv/app

