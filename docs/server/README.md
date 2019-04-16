# API Server: Node, Express, Mongo

> This sub-project provides the API server

See the code in the server/src directory. The intention is for the code to be provide 
much of the documentation.  See the [docker](/server/docker/) docs for more about how the containerization is managed.

This sub-project was initially based on 
[https://dev.to/jay97/docker-compose-an-express-and-mongo-app-aai](https://dev.to/jay97/docker-compose-an-express-and-mongo-app-aai)
and
[https://nodejs.org/de/docs/guides/nodejs-docker-webapp/](https://nodejs.org/de/docs/guides/nodejs-docker-webapp/)


## Run

To run the server ....
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

To test the server ```curl http://localhost:3005``` (may need to adjust the port as configuration changes)


## package.json

```
    ...
  "scripts": {
    "start": "node index.js",
    "start.dev": "nodemon -L"
  },
  ...
```
[https://github.com/docker/labs/issues/378](https://github.com/docker/labs/issues/378)
Nodemon inside a docker container requires the use of the legacy watch flag -L
[https://gist.github.com/ksmithut/e126f7ddb40b760487a17e8b569a77b5](https://gist.github.com/ksmithut/e126f7ddb40b760487a17e8b569a77b5)


