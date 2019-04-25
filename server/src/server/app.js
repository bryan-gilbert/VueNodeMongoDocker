import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import db from './db'
import Api from './api'

const debug = require('debug')('server')

export default class App {
  constructor() {
    this.app = express()
  }

  get application() {
    return this.app
  }

  setup(config) {
    const {app} = this
    const api = new Api(app, config)
    this.bodyParse()
    this.i18n()
    this.initViewEngine()

    return db(config)
      .then(connection => {
        app.connection = connection
        return api.apiMiddle()
      })
      .then(() => {
        debug('api done. Next final routing')
        return api.apiError()
      })
      .then(() => {
        debug('App setup complete')
      })
  }

  initViewEngine() {
    const {app} = this
    // Set view folder
    app.set('views', path.join(__dirname, '/views'))
    // App.set('views', path.join(serverFolder, 'views'))
    app.set('view engine', 'pug')

    // Environment dependent middleware
    // if (isDevMode()) {
    app.set('showStackError', true)

    // Disable views cache
    app.set('view cache', false)
    // App.use(helmet.noCache())

    // Jade options: Don't minify html, debug intrumentation
    app.locals.pretty = true
    // App.locals.compileDebug = true;

    // } else {
    //   app.locals.cache = 'memory'
    //   app.set('view cache', true)
    // }
  }

  i18n() {
    const {app} = this
    // Place holder to sometime later add in i18next translation.
    // for now define a no-op function on the app and by extension on all request objects.
    // Usage:  req.t('some string')
    app.t = txt => {
      return txt
    }
  }

  bodyParse() {
    const {app} = this
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
  }
}
