# LearnAnyLanguage
A web application that can help you learn any language. You can upload your favorite list of words and practice as much as you like.

## Technologies
- Typescript (NestJS, TypeORM)
- React 
- React dom router
- NPM and Yarn
- PostGres database

## Development build and run
You need to have a local PostGres database running at port `5432`. ([config](backend/src/orm.config.ts)). Furthermore, you need to have Node installed. Then you need to open 3 command prompts/shells:

### Backend
    - `cd backend`
    - `npm install`
    - `npm run start:dev`

### Frontend
    - `cd frontend`
    - `npm install`
    - `npm run start`

### Proxy
    - `cd proxy`
    - `npm install`
    - `npm run start`

## Docker build and run

### Backend
    - `cd backend`
    - `docker build -t backend:latest .`


### Frontend
    - `cd frontend`
    - `docker build -t frontend:latest .`

### Proxy
    - `cd proxy`
    - `docker build -t proxy:latest .`

### Database 
    - `cd db`
    - `docker build -t db:latest .`

### Run all at the same time
    - `docker compose up -d`

Then you can access the frontend at [http://localhost:8282](http://localhost:8282) and the backend APIs at [http://localhost:8180](http://localhost:8180). The database runs at port `5432`.


## Credits and inspiration
- [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)
- [Setup typescript project](https://khalilstemmler.com/blogs/typescript/node-starter-project/).
- [Setup express webserver](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)
- [Setup NEST RestController](https://github.com/nestjsx/crud/wiki/Controllers#getting-started)


## TODO-list
- Bugs 
    * Error when opening list
    * React issues
    * Demo video on Youtube




