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

![unchecked] WIP: To do for this project is to have a single docker configuration and yet choose between the production
             and development script.  Currently, the set up loads 'start.dev' with hot swap via ```nodemon```
 

[checked]: ../images/checked-20.png "checked"
[unchecked]: ../images/unchecked-20.png "unchecked"


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


## Placeholder for I18N

Add a method to the application that can be used to translate strings. Use this on the server side to translate
strings that are sent back from the API.  It's far easier to start using this wrapper in the early stages of development
rather than adding it later.  Decide later what package you wish to use to manage translatios.


    // Place holder to sometime later add in i18next translation.
    // for now define a no-op function on the app and by extension on all request objects.
    // Usage:  req.t('some string')
    app.t = txt => {
      return txt
    }


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
