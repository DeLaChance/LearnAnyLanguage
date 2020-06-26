FROM node:latest AS proxy

ENV PORT 8181

WORKDIR /root/proxy/
COPY *.js *.json ./
RUN ls ./index.js
RUN yarn --verbose install

EXPOSE 8181

CMD [ "yarn", "run", "start" ]
