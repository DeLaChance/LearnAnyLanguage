FROM node:latest AS proxy

ENV PORT 8181

WORKDIR /root/
COPY src ./root/src/
COPY *.json /root/
RUN npm install
COPY node_modules /root/node_modules/


EXPOSE 8181

CMD cd /root/ && npm run start
