FROM node:latest AS frontend

WORKDIR /root/frontend/

COPY src ./src/
COPY public ./public/

COPY *.json ./
COPY .env ./
RUN npm i
RUN npm run build
RUN npm i -g serve

EXPOSE 8182

CMD cd /root/frontend/ && serve -s build -p 8182
