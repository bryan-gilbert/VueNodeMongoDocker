# Node Express Vue, Mongo with Docker -- MEVN-D

> This is a sample/template project with Dockerized Node, Express, Vue.js, MongoDB. Use it to learn or as a base for an application.
Much of the development environment assumes a Mac or Linux environment.

This project is a template / example of a Dockerized client server application.  The intention is to provide both a seed
project for any situation requiring a rich client with backend API supported by a database and provide a project to 
collect, over time, a set of practical tools and techniques that represent some of the current best practices.

The intention is to build a small-scale production ready sample application on the MEVN stack.  By small-scale we mean one
server machine sufficient to prove to the world that your application is the greatest.  You'll then want to look at Kubernetes
and/or OpenShift to scale up.
This project is trying to bridge the gap between the many excellent tutorial sample applications and a project that combines
these into a workable application.


## Features

Features that are ready are ![checked] and those that need work are ![unchecked]  

### Docs
- ![checked] VuePress 
- ![checked] Published on public github page
- ![checked] One line commands to run or build.
- ![checked] Script automates deployment
- ![checked] Style overrides
- ![checked] Multiple sub-project pages
- ![checked] Navigation:  sidebar, header, search bar
- ![checked] With images and relative files 

### Server: Node, Express, MongoDB, Docker, Nginx

Docker
- ![checked] One line startup
- ![checked] Hot updates during development
- ![checked] Docker with site specific settings (e.g. mongo passwords) 
- ![checked] Environment variable handling
- ![unchecked] One common source for both Prod and Dev with absolutely minimal differences.
- ![unchecked] One line startup for both Prod and Dev
 
Node, Express
- ![checked] Node.js with Express  
- ![checked] Simple get and post API example calls
- ![unchecked] User authentication with password and JWT


MongoDb 
- ![checked] MongoDB Dockerized
- ![unchecked] Mongo authentication

Nginx / Domain and Site
- ![unchecked] Nginx proxies all access to the application
- ![unchecked] Support API calls on the same domain as the client 
- ![unchecked] HTTPS only

Production setup instructions
- ![unchecked] Firewall blocks all ports except 80 and 443 (and ssh)
- ![unchecked] No SSH access via root user
- ![unchecked] No SSH access via password (SSL only) 


### Client: Vue, Vuex, Events
- ![unchecked] The intention on the client side is to use Vue.js.  Vue.js provides many features like hot-swapping for development and static file delivery for production.
- ![unchecked] Axios for make API calls.
- ![unchecked] Vuex for client side storage of data. Ideal for storing the results of API calls because Vue will detect changes and trigger a page refresh. 

[checked]: ./images/checked-20.png "checked"
[unchecked]: ./images/unchecked-20.png "unchecked"


## Setup

After checking out this repository be sure to set up the local site-specific environment as described in the 
[/server/docker.md](docker) page.

## Docs

These documents are produced using VuePress. <img src="https://vuepress.vuejs.org/hero.png" alt="vuepress" style="width:50px;"/> 
- To learn more see the [docs](/docs/) pages.  
- To run the docs server in a development environment:
```
yarn docs:dev
```
- Then visit  [http://localhost:8080/](http://localhost:8080/)




## Domain names and development

If working on a Mac there is away to create a temporary domain for your local testing and practice.  Assuming
you've developed your project onto a virtual server, say, from DigitalOcean.  And assume you're project is now running and
available on, say, http://xx.xx.xx.xx/myProject.  To set up a temporary, on-your-machine-only, domain you can edit the 
```etc/hosts```  file and add a line

```
xx.xx.xx.xx myDomain.com
``` 

Then in a terminal window force the DNS system to refresh
```
sudo killall -HUP mDNSResponder
```

If you are following along and setting up this project then add the following to your etc/hosts file and reset the DNS responder

```
127.0.0.1       jbrjga.dev
127.0.0.1       jbrjga.com
```
You can then, on your machine only, browse to ```http://jbrjga.com/myProject``` and see your project. By the way, the 
domain names above are just some lower case random letters that are easy to type and won't collide with any real world domain.


## Twelve Factors

This project strives to follow [the 12 factors](https://12factor.net/)

 . | Factor | Description
-- | ------ | ------------
I. | Codebase | One codebase tracked in revision control, many deploys
II. | Dependencies | Explicitly declare and isolate dependencies
III. | Config | Store config in the environment
IV. | Backing services | Treat backing services as attached resources
V. | Build, release, run | Strictly separate build and run stages
VI. | Processes | Execute the app as one or more stateless processes
VII. | Port binding | Export services via port binding
VIII. | Concurrency | Scale out via the process model
IX. | Disposability | Maximize robustness with fast startup and graceful shutdown
X. | Dev/prod parity | Keep development, staging, and production as similar as possible
XI. | Logs | Treat logs as event streams
XII. | Admin processes | Run admin/management tasks as one-off processes