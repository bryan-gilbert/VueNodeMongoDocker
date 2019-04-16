# Docker
> Intention to describe how this project uses Docker

Assumes you have docker and docker-compose installed.

- [Docker install for Mac](https://docs.docker.com/v17.12/docker-for-mac/install/)
- [Docker install for Ubuntu](https://docs.docker.com/v17.12/install/linux/docker-ce/ubuntu/)
- [Docker-compose install](https://docs.docker.com/compose/install/)
- [Docker cheat sheet](https://gist.github.com/dwilkie/f8d6526edc5f1a8aca385df5113567e4)
- [DockerHub](https://store.docker.com/) You need access to an account on DockerHub  


## Mounts denied

On the Mac when you first start the app you will likely see an error like this:

``` 
ERROR: for simple-app  Cannot start service simple-app: b'Mounts denied:
The path ... is not shared from OS X and is not known to Docker. 
You can configure shared paths from Docker -> Preferences... -> File Sharing.
```
See [https://docs.docker.com/docker-for-mac/osxfs/#namespaces](https://docs.docker.com/docker-for-mac/osxfs/#namespaces) for more info.

Generally, I opt to add the relevant project folder into the File Sharing tab of the Docker App.  You'll do it once
and forget about this problem until the next time.

## Dockerfile

The API container is defined by the ```Dockerfile```.   

WIP:  I want a better way to manage the prod vs dev environments and to manage the configuration parameters that need to be site 
specific such as db passwords.  Here are some articles I'm reading about now

- [https://vsupalov.com/docker-arg-env-variable-guide/](https://vsupalov.com/docker-arg-env-variable-guide/) to learn how best to pass arguments around. It's
a long but very worthwhile read.

- [https://medium.com/softonic-eng/docker-compose-from-development-to-production-88000124a57c](https://medium.com/softonic-eng/docker-compose-from-development-to-production-88000124a57c)

Extract:
> - All my stacks for production, development (or other environments) are defined via docker-compose files.
> - The compose files needed to cover all my environments are avoiding as much as possible configuration duplication.
> - I just need one simple command to work on each environment.
> - Define your productive configuration in the docker-compose.yml file.
> - Define environment variables to identify image tags or other variables that could change for any environment (staging, integration, production).
> - Use the production values as defaults, this minimizes impact in case you launch the stack in production without an expected variable.
> - In production deploy with the docker stack deploy --compose-file docker-compose.yml --with-registry-auth my-stack-name command.
> - Launch your development environment with docker-compose up -d.


The next two are for docker compose version 2 yet are likely to work for version 3.  This developer is including methods to set up SSL as well, with LetsEncrypt    
- [https://modulitos.com/2016/03/lets-deploy-part-1/](https://modulitos.com/2016/03/lets-deploy-part-1/)
- [https://modulitos.com/lets-deploy-part-2/](https://modulitos.com/lets-deploy-part-2/)

## Copy vs Add
The recommendation is to use COPY unless you need the more powerful ADD.
COPY transfers files from the local machine into the container.



## Docker compose file
Docker-compose is a lightweight container orchestration tool useful to coordinate one or more Docker containers. It can
coordinate containers defined outside the application as well. (See https://docs.docker.com/compose/compose-file/#external_links)

[docker compose reference](https://docs.docker.com/compose/compose-file/)

Docker-compose files are written in YAML. A short one-page guide to YAML can be found [here](https://learnxinyminutes.com/docs/yaml/)

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


## Ports and Expose

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
[https://stackoverflow.com/questions/40801772/what-is-the-difference-between-docker-compose-ports-vs-expose](https://stackoverflow.com/questions/40801772/what-is-the-difference-between-docker-compose-ports-vs-expose)



## Persistent storage
What if I want my database to be on a distant server, not to run locally on my isolated machine?
[https://community.grafana.com/t/new-docker-install-with-persistent-storage-permission-problem/10896](https://community.grafana.com/t/new-docker-install-with-persistent-storage-permission-problem/10896)

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
