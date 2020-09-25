#!/bin/sh
cd backend/
docker build -t backend:latest .

cd ../frontend/
docker build -t frontend:latest .

cd ../proxy/
docker build -t proxy:latest .

cd ../db
docker build -t db:latest .

docker-compose up -d
