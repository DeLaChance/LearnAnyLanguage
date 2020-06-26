FROM node:latest AS frontend

WORKDIR /root/frontend/

COPY src ./src/
RUN ls ./src/config/
RUN sed -i 's/localhost\:8180/backend\:8180/' ./src/config/config.json
RUN sed -i 's/localhost\:8181/proxy\:8181/' ./src/config/config.json

COPY *.json ./
RUN yarn --verbose install

EXPOSE 8182

CMD cd /root/ && npm run start
