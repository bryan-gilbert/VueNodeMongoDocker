# Docs: VuePress

> VuePress creates static Vue compatible Single Page Application

VuePress docs recommended using yarn in some situations. When I've accidentally 
used npm there have been errors. So use yarn for the VuePress side of this project.


## Run
Start this project docs

```
yarn docs:dev
```

## Build
To generate static assets, run:
```
yarn docs:build 
```

## Deploy

From the command line, in the project root directory, run ```./docDeply.sh```
This builds the docs into a SPA and pushes the changes to the github.io project repro. Go view the docs online at;

[https://bryan-gilbert.github.io/VueNodeMongoDocker/](https://bryan-gilbert.github.io/VueNodeMongoDocker/)

For more details see the VuePress docs: [VuePress Deploy Guide](https://vuepress.vuejs.org/guide/deploy.html#github-pages)


## Setup

To build a VuePress docs site from scratch ....
``` 
# install VuePress as a local dependency
yarn add -D vuepress 

# create a docs directory
mkdir docs

# create a markdown file
echo '# Hello VuePress' > docs/README.md 
```

Add scripts to package.json:

```
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```
