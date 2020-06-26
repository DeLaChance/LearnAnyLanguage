# LearnAnyLanguage
A web application that can help you learn any language. You can upload your favorite list of words and practice as much as you like.
You can see a [demo video](https://youtu.be/sEcO9Zoa6vo) showcasing some of the features of this app.


## Technologies
- Typescript (NestJS, TypeORM)
- React 
- React dom router
- NPM and Yarn
- PostGres database

## Development build and run
You need to have a local PostGres database running at `localhost:5432`. You can also set some environment variables ([see this config](backend/src/orm.config.ts)). Furthermore, you need to have Node installed. Then you need to open 3 command prompts/shells:

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

## Word list file format
Word lists need to be uploaded in self-defined `*.lst`-format. Examples are in [here](backend/example-lists/).


## Credits and inspiration
- [Thinking in React](https://reactjs.org/docs/thinking-in-react.html)
- [Setup typescript project](https://khalilstemmler.com/blogs/typescript/node-starter-project/).
- [Setup express webserver](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)
- [Setup NEST RestController](https://github.com/nestjsx/crud/wiki/Controllers#getting-started)


## TODO-list
- Open bugs 
    * Refresh needed sometimes. E.g. after uploading a list.
    * React issues
    * Merge docker changes into branch





