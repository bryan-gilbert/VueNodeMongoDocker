# Docs: VuePress

> VuePress creates a static Vue compatible Single Page Application for your project documentation.

VuePress docs recommended using yarn in some situations. When I've accidentally 
used npm there have been errors. So use yarn for the VuePress side of this project.


## Run
Start the project docs in development mode:

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

[https://bryan-gilbert.github.io/mevnd-plate/](https://bryan-gilbert.github.io/mevnd-plate/)

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

# run the VuePress hot swap builder and web server
yarn docs:build  
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

## Customization

Can override CSS in the file ```.vuepress/style.styl```

Customize the site in ```.vuepress/config.js```.  The following illustrates how to 
set up a project with a title, description, url base, and how to configure the default theme.
The theme has a title bar with navigation and search; side bar navigation; and all
sidebar file headers stay open and are visible.

Assuming the directory structure is like this

```
.
├─ README.md
├─ server/
│  ├─ README.md
│  ├─ docker.md
│  ├─ mongodb.md
│  └─ express.md
├─ docs/
│  └─ README.md
└─ client/
   └─ README.md

```
Those README.md files will be converted into index.html files and they can be referenced
with a path that ends in '/'.  The rest are referenced with a full absolute path.

```js
module.exports = {
  title: 'The title',
  description: 'key message',
  base: "/projectDirectoryName/",
  themeConfig: {
    displayAllHeaders: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' },
      { text: 'Server', link: '/server/' },
      { text: 'Client', link: '/client/' },
    ],
    sidebar: [
      {
        title: 'Project',
        children: [
          '/'
        ]
      },
      {
        title: 'Docs',
        children: [
          '/docs/'
        ]
      },
      {
        title: 'Server',
        children: [
          '/server/',
          '/server/express.md',
          '/server/mongodb.md',
          '/server/docker.md'
        ]
      }
    ]
  }
}
```
