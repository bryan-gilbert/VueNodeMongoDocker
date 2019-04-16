module.exports = {
  title: 'Vue, Node, Mongo, Docker',
  description: 'Just playing around',
  base: "/VueNodeMongoDocker/",
  configureWebpack: {
    resolve: {
      alias: {
        '@images': 'images'
      }
    }
  },
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
          '/server/express/',
          '/server/mongo/',
          '/server/docker/'
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