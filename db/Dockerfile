FROM postgres:latest as db
WORKDIR /docker-entrypoint-initdb.d
COPY setup.sh /docker-entrypoint-initdb.d/
EXPOSE 5432
