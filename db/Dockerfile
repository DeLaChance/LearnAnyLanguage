FROM postgres:latest as db
WORKDIR /docker-entrypoint-initdb.d
ADD create_db.sql /docker-entrypoint-initdb.d
EXPOSE 5432