# Node Express Vue, Mongo with Docker -- MEVN-D

> a dockerized client server project 

## Documentation
See the project documentation on line in the GitHub Pages here:
[https://bryan-gilbert.github.io/mevnd-plate/](https://bryan-gilbert.github.io/mevnd-plate/)


To run and view the docs locally run
```
npm run docs:dev
```
To push doc changes to the online server run
```
./docDeploy
```

Then visit  [http://localhost:8080/](http://localhost:8080/)

## Vue Client
To create a new Vue client sub-project see the read me in ```vueCreate```

Be sure to build your client
```
cd client
npm run build 
```


## Status
- Aug 4 2019. 
  - Rework project and create a Vue create project tool.
  - Move docker compose files into a deploy folder.
  - Build the client
  - Ran docker compose and verified that customized client was visible (localhost:80)
  - Next steps 
    - customize the client/server so the client uses the server API
    - let the API interact with the db
