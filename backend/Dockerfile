FROM node:latest AS backend

ENV DB_HOST "db"
ENV DB_PORT 5432
ENV DB_USER "postgres"
ENV DB_PASSWORD "postgres"

WORKDIR /root/
COPY src ./root/src/
COPY *.json /root/
RUN npm install
COPY node_modules /root/node_modules/

EXPOSE 8180

# Start the container in DEV mode
CMD cd /root/ && npm run start:dev
