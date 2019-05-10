# API Server: Node, Express, Mongo

> The server sub-project provides the API server

The sub-project is located in ```server/```
The code is located in ```server/src/``` directory.
The code should be self-documenting.
Our [docker](/server/docker.md) docs say more about how the containerization is managed.

This sub-project borrows from 
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

![unchecked] WIP: To do for this project is to have a single docker configuration and yet choose between the production
             and development script.  Currently, the set up loads 'start.dev' with hot swap via ```nodemon```
 

[checked]: ../images/checked-20.png "checked"
[unchecked]: ../images/unchecked-20.png "unchecked"


Nodemon monitors the code for changes and restarts the server when it sees changes. When Nodemon is used inside a docker
container it requires the use of the legacy watch flag -L
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


## Placeholder for I18N

We add a method to the express application that can be used, in the future, to translate strings.
It's far easier to start using this wrapper in the early stages of development
rather than adding it later.  You can decide later what package you wish to use to manage translations.

```
app = express()
...
// Usage:  req.t('some string') returns the same string but in the future you can translate the text
app.t = txt => {
  return txt
}
```

## Unhandled rejections and exceptions

In some high level module define a set of handlers for any exceptions or promise rejections that are not handled by
the code.  Optionally exit the process.

```js
function initUnhandled() {
  /*
  Define application wide handlers for unhandled exceptions and rejections.
  See https://nodejs.org/api/process.html#process_event_unhandledrejection
   */
  if (process.listeners('unhandledRejection') < 2) {
    process.on('unhandledRejection', (error /* , promise */) => {
      debug('-=-=-=-=-= UNHANDLED REJECTION %s %O', error, error.stack)
    })
  }

  if (process.listeners('uncaughtException') < 2) {
    process.on('uncaughtException', error => {
      debug('.-.-.-.-.-. UNCAUGHT EXCEPTION %s %O', error, error.stack)
    })
  }
}
```
