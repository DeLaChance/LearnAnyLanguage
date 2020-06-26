FROM node:latest AS backend

ENV DB_HOST "db"
ENV DB_PORT 5432
ENV DB_USER "postgres"
ENV DB_PASSWORD "postgres"

WORKDIR /root/backend/
COPY src ./src/
COPY *.json ./
RUN ls ./src/index.ts
RUN yarn install --verbose

EXPOSE 8180

# Start the container in DEV mode
CMD [ "yarn", "run", "start:dev" ]
