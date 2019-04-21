import express from 'express'
import bodyParser from 'body-parser'
import db from './db'
import { apiMiddle, apiError } from './api.js'
const debug = require('debug')('server')

export default class App {
  constructor () {
    this.app = express()
  }

  get application () {
    return this.app
  }

  setup (config) {
    const _this = this
    const app = this.app
    this.initViewEngine()
    // place holder to sometime later add in i18next translation.
    // for now define a no-op function on the app and by extension on all request objects.
    app.t = (txt) => { return txt }
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    return db(config)
      .then(connection => {
        app.connection = connection
        return apiMiddle(app, config)
      })
      .then(api => {
        debug('api middle is set up next set up the final routing')
        app.use('/', api)
        return _this._setupFinalMiddle(app, config)
      })
      .then(api => {
        debug('App setup complete')
      })
  }

  initViewEngine () {
    let app = this.app
    // Set view folder
    app.set('views', __dirname + '/views')
    // app.set('views', path.join(serverFolder, 'views'))
    app.set('view engine', 'pug')

    // Environment dependent middleware
    // if (isDevMode()) {
    app.set('showStackError', true)

    // Disable views cache
    app.set('view cache', false)
    // app.use(helmet.noCache())

    // Jade options: Don't minify html, debug intrumentation
    app.locals.pretty = true
    //app.locals.compileDebug = true;

    // } else {
    //   app.locals.cache = 'memory'
    //   app.set('view cache', true)
    // }
  }

  _setupFinalMiddle (config) {
    let app = this.app
    app.get('/', (req, res) =>{
      debug('Got foo a / request')
      res.send('it\'s working :)\n')
    })

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      _this._fourOhFour(req, res)
    })
    apiError(app, config)
  }

  _fourOhFour (req, res) {
    let { url } = req
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    let env = process.env.NODE_ENV
    if (url.includes('favicon')) {
      debug('Another request for the favicon')
      res.status(404).send('No favicon')
    } else {
      let msg = 'Could not find "' + fullUrl + '". Environment: ' + env
      debug(msg)
      res.status(404).send(msg)
    }
  }
}
