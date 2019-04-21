# API Server: Node, Express, Mongo

> This sub-project provides the API server

See the code in the server/src directory. The intention is for code to be self-documenting.  
Also see the [docker](/server/docker.md) docs for more about how the containerization is managed.

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

WIP: To do for this project is to have a single docker configuration and yet choose between the production
and development script.  Currently, the set up loads 'start.dev' with hot swap via ```nodemon```

Nodemon monitors the start script and detects changes to the dependant code. It'll restart
the server when it sees changes. When Nodemon is used inside a docker container it requires the use of the legacy watch flag -L
```
    ...
  "scripts": {
    "start": "node index.js",
    "start.dev": "nodemon -L"
  },
  ...
```
- [https://github.com/docker/labs/issues/378](https://github.com/docker/labs/issues/378)
- [https://gist.github.com/ksmithut/e126f7ddb40b760487a17e8b569a77b5](https://gist.github.com/ksmithut/e126f7ddb40b760487a17e8b569a77b5)


