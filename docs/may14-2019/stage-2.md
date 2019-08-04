# Stage 2 - Debian Server with Nginx in Docker, NPM, Node, Vue

> Build on stage 1: secure server, and add Nginx (web server) in docker container with Vue client

The following steps take about 10 minutes to complete with a reasonable internet connection.

Prerequisite: you have a secure server setup as described in Stage 1 

Objective: We will have a web server that is both production ready and has a great developer experience.  

We're using nginx for our web server because it is by far the best choice for our application architecture that is comprised
of static web resources complimented by API calls supported by a backend database.

## Install Docker on Debian

For complete details see the [docs](https://docs.docker.com/install/linux/docker-ce/debian/).

Why Debian?  We can just as easily use Ubuntu for our demonstrations because Ubuntu is a fork of Debian.  Your choice when
you extend your application.  I've chosen Debian because the work can easily port to Ubuntu if needed and Debian is known
to the more stable and secure. [see point 11](https://www.ubuntupit.com/debian-vs-ubuntu-top-15-things-to-know-before-choosing-the-best-one/)


### Set up the debian repository for docker
```
sudo apt-get update
 
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88
# verify the finger print is 9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88

# get the stable version 
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
```

### Install Docker-CE
```
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# verify all is well ...
sudo docker run hello-world
```

### Install Docker-Compose
For complete details see the [docs](https://docs.docker.com/compose/install/)
The docs show how to install docker-compose on Mac, Windows, Linus, etc.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

sudo docker-compose --version
```

### Install NPM, Node 
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -

sudo apt-get install -y nodejs
```

### Setup our sample project

It's not necessary to clone the project repository because there are just a few files needed to setup Nginx in a Docker container
and have it serve content from a Vue project.  Yet, using the project is recommended if you want to go onto the next stage. 
First here are the steps to take with the repo

```
git clone https://github.com/bryan-gilbert/mevnd-plate.git

cd vue

npm install # use the package.json

node  node_modules/@vue/cli/bin/vue.js create my-project

cd my-project

nom run build 

cd ../.. # back to repo root

sudo docker-compose -f d-c.yml up 
``` 

At this point you can view the sample application in your browser: http://\<ip address>

So, what's happened? 
1. The npm install got the Vue CLI tool installed ready to go.
2. Use the VLI to create a sample project: my-project
3. Go into the sample Vue project and run the build. This compiles static html, css, and js files based on the Vue source.
4. Return to the root directory and launch Nginx inside the docker container. 

## Development environment
The only parts of this stage that a developer might want to work on is the Vue client. For this the best thing to use is the
Vue hot-swapping server.  It's amazing how it can push changes into the browser.  Run the following in the my-project folder
``` 
npm run serve
``` 


## Details
We start by setting up the server with Docker, npm and node.js. 

Very few files contribute to this stage.  We need a very simple Docker file to set up nginx and a docker-compose file to join the nginx
with the static web site.  Plus we set up our vue directory.  Note that we don't install nginx on our server.  By placing nginx in a container
we can run the same container, with exactly the same configuration, on both our development box and any server we wish. 

This stage could have used another web technology other than Vue. React, Angular, and others are all fine for the purposes here.
I've chosen Vue because I'd like to use it and it's simple to get up and running.  One command to create a project. One to
run a development instance and one to build the production ready static web site.  That's perfect for our needs here today.

Initial directory structure
```
.
├─ stage2-docker-compose.yml
├─ vue/
└─ nginx/
   └─ DOCKERFILE
```

We then initialize the vue directory to make it a npm project.  ```npm init``` asks us a series of questions that, for now,
we just accept the defaults. It also creates the basic ```package.json``` file.  This allows us to install Vue client and keep
the setup.  Next we create the sample Vue client. 
```
cd vue
# to create package run
npm install  @vue/cli —save
```
Next we built this client to produce the production ready static web site.
```
cd vue/my-project
# to build the client sample vue web site run
npm run build
```
We end with a directory structure like this:

```
.
├─ stage2-docker-compose.yml
├─ vue/
│  ├─ package.json
│  └─ my-project/
│     ├─ dist/
│     ├─ public/
│     ├─ src/
│     └─ package.json
└─ nginx/
   └─ DOCKERFILE
```
When we build the vue client the ```dist``` folder is created and it contains the static web site. We link this directory to
in our docker compose file to tell nginx to server this directory for all requests to our site.

For development of our vue client we run
```
cd vue/my-project
# to build the client sample vue web site run
npm run serve
```
This launches the vue hot-swap server which watches for changes to your code, retranspiles the files and pushes the changes
to your open browser window. 


The nginx docker file is very simple, for now. It has one line that loads the nginx image from the docker hub repository.
In fact we could do without the docker file and place this image line in the docker compose file but we'll need this
nginx docker file for the next stage to set up the proxy to the API.

nginx/DOCKERFILE
```
FROM nginx
``` 

./stage2-docker-compose.yml
```
version: "3"
services:
  nginx:
    container_name: nginx
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
    volumes:
      - "./vue/my-project/dist/:/usr/share/nginx/html/"
```
