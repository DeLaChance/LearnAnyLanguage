FROM node:latest AS frontend

WORKDIR /root/
COPY src ./root/src/

RUN sed -i 's/localhost\:8180/backend\:8180/' src/config/config.json
RUN sed -i 's/localhost\:8181/proxy\:8181/' src/config/config.json

COPY *.json /root/
RUN npm install
COPY node_modules /root/node_modules/

EXPOSE 8182

CMD cd /root/ && npm run start
