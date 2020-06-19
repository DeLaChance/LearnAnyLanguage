FROM node:latest

ENV DB_HOST "db"
ENV DB_PORT 5432
ENV DB_USER "postgres"
ENV DB_PASSWORD "postgres"

EXPOSE 8081
COPY ./src ./*.json /root/

# Start the container in DEV mode
CMD cd /root/ && npm run start:dev