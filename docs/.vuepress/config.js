const path = require("path");

module.exports = {
  title: 'Vue, Node, Mongo, Docker',
  description: 'This is a sample/template project with Dockerized Node, Express, Vue.js, MongoDB. https://github.com/bryan-gilbert/mevnd-plate',
  base: "/mevnd-plate/",
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
          '/server/docker.md',
          '/server/express.md',
          '/server/mongodb.md'
        ]
      },
      {
        title: 'Client',
        children: [
          '/client/'
        ]
      }
    ]
  }
}
