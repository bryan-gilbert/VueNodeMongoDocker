# Docker containerized client server 

> This is a sample/template project. Use it to learn or as a base for an application

This project is a template / example of a Dockerized client server application.  The intention is to have a client web site
that uses Vue.js.  Vue.js provides many features like hot-swapping for development and static file delivery for production.
The current version of this project does not yet have a client. The current version is focused on the server.

The server side of the project is a Node.js Express web service to provide API calls on data stored in a MongoDB. The server and
db are in separate docker containers.  

In development the client works directly with the server via calls to the exposed port.  In production, the API server 
exposes a port that is proxied by Nginx.

The intention is to have a nginx web server be the only public point of contact and let it serve the statice client files
and proxy the API calls to the hidden API server.

The intention is for the site to be secured via https.


Initially based on 
https://dev.to/jay97/docker-compose-an-express-and-mongo-app-aai
and
https://nodejs.org/de/docs/guides/nodejs-docker-webapp/


## Run
```
docker-compose up --build
```

Or run the services in the background and optionally follow the logs of a container
```
docker-compose up --build -d 

docker-compose logs -f simple-app
```

To see what's inside a container run the exec command with sh
```
docker-compose exec simple-app sh
```

To test the server ```curl http://localhost:3005```

# Server

See the code in the server/src directory. The intention is for the code to be provide 
much of the documentation.

## package.json

```
    ...
  "scripts": {
    "start": "node index.js",
    "start.dev": "nodemon -L"
  },
  ...
```
https://github.com/docker/labs/issues/378
Nodemon inside a docker container requires the use of the legacy watch flag -L

https://gist.github.com/ksmithut/e126f7ddb40b760487a17e8b569a77b5

## Docker
Docker cheat sheet
https://gist.github.com/dwilkie/f8d6526edc5f1a8aca385df5113567e4

### Copy vs Add
The recommendation is to use COPY unless you need the more powerful ADD.
COPY transfers files from the local machine into the container.



## Docker compose file
Docker-compose is a lightweight container orchestration tool useful to coordinate one or more Docker containers. It can
coordinate containers defined outside the application as well. (See https://docs.docker.com/compose/compose-file/#external_links)

Reference:
https://docs.docker.com/compose/compose-file/    

Many example projects use simple and/or default names for the docker services. This project doesn't so that you can see
how the container names play a role both inside and outside your app.  For example the mongoDB container is called
```simple-app-mongo```  instead of the usual ```mongo```.  The service name needs to be used, in the server code,
when establishing a connection to the database.  (The intention for this project is to store configuration
in the file system so the following example may not match the code but, the results will alwaus be the same.)

```
// the service as defined in the docker-compose.yml file
const DOCKER_MONGO_SERVICE_NAME = 'simple-app-mongo'
const MONGO_PORT = 27017
const dbName = 'simpleApp'
const cStr = 'mongodb://'+DOCKER_MONGO_SERVICE_NAME+':' + MONGO_PORT + '/' + dbName
```


### Ports and Expose

When starting out with Docker its sometimes difficult to remember how to use the ```ports``` property.  The reference says
the parts are ```HOST:CONTAINER``` yet it is sometimes easier to think of these parts as 'from the inside' to 'the outside'.
The 'inside' is the port the server is listening on. The 'outside' is the port the client uses to get to this service.

This project uses different ports for these two sides only to provide a clear example.  Hopefully, this makes it easy 
to see exactly what you might need to edit to support a more complicated network of containers. 

ports:
    - "outside:inside"

Or use the long format and be explicit
ports:
  - target: 80
    published: 3003
    protocol: tcp
    mode: host    
    
Expose ports without publishing them to the host machine - they’ll only be accessible to linked services. 
Only the internal port can be specified.    

expose: "3003"

The docker command line way to do this is ```docker run -p 80:3000 my-node-app``` . The server running on port 3000 
will be available through HTTP (port 80). First the container port, then the image port.


https://stackoverflow.com/questions/40801772/what-is-the-difference-between-docker-compose-ports-vs-expose


But… I want my database to be on a distant server, not to run locally on my isolated machine.

### Persistent storage
https://community.grafana.com/t/new-docker-install-with-persistent-storage-permission-problem/10896

    volumes:
      - .:/app


## Docker clean up
```
docker system prune

docker system prune --volumes

docker container ls -a


docker container stop $(docker container ls -aq)
docker container rm $(docker container ls -aq)


docker image ls
# To remove all images which are not referenced by any existing container, not just dangling ones, use the -a flag:
docker image prune -a
```


## Mongo

### Authentication
See
https://medium.com/rahasak/enable-mongodb-authentication-with-docker-1b9f7d405a94

https://docs.mongodb.com/manual/tutorial/enable-authentication/
https://stackoverflow.com/questions/4881208/how-to-secure-mongodb-with-username-and-password
https://docs.bitnami.com/bch/apps/lets-chat/administration/change-reset-password/


## Mongoose
https://mongoosejs.com/docs/api.html#

## Vue CLI
https://cli.vuejs.org/guide/


## Express

### Security
https://expressjs.com/en/advanced/best-practice-security.html

### File Store Sessions
https://www.npmjs.com/package/session-file-store