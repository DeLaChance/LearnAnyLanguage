#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE learnanylanguage;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "learnanylanguage" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE learnanylanguage TO postgres;
    CREATE SCHEMA IF NOT EXISTS learnanylanguage;
EOSQL
