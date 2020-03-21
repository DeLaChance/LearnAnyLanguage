# Backend code

## Prerequisites
- You need to have Node and npm installed
- Familiar with Node and npm

## Commands
- `npm run start:dev`: Starts the application in development using nodemon and ts-node to do cold reloading.
- `npm run build`: Builds the app at build, cleaning the folder first.
- `npm run start`: Starts the app in production by first building the project with npm run build, and then executing the compiled JavaScript at build/index.js.

## API's:

### Add/Update a Language
`curl -H 'Content-Type: application/json' -H 'Accept: application/json' -X PUT --data '{ "iso2Code": "FR" , "name" : "French" }' localhost:8180/api/languages`

## Links
Used these sources when building this:
 - [Setup typescript project](https://khalilstemmler.com/blogs/typescript/node-starter-project/).
 - [Setup express webserver](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)
 - [Setup NEST RestController](https://github.com/nestjsx/crud/wiki/Controllers#getting-started)

## TODO:
- Websocket integration
- React frontend
