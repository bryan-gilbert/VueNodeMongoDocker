// Import express from 'express'
import moment from 'moment'
// Import cors from 'cors'
import dbSeeder from '../config/lib/db-seeder'
import UserController from '../controllers/user-controller'

// Sessions and session cookies
// express-session stores session data here on the server and only puts session id in the cookie
const session = require('express-session')
const FileStore = require('session-file-store')(session)

// Session ids
const uuid = require('uuid/v4')

const debug = require('debug')('server')

export default class Api {
  constructor(app, config) {
    this.app = app
    this.config = config
  }

  apiMiddle() {
    const {app, config} = this
    this._setupSession()
    this._setupTrace()
    return this._seeding().then(() => {
      // Const corsOptions = this._setupCors()
      // Const router = express.Router() // eslint-disable-line new-cap
      const user = new UserController(config)
      debug('Set up get for / ')
      app.get('/', (req, res) => {
        debug('Got middle a / request')
        res.send('home\n')
      })
      app.get('/about', (req, res) => {
        res.send('about\n')
      })
      // Inside API
      debug('Set up get for /user ')
      app.use('/user', user.route())
      // Router.use('/user', cors(corsOptions), user.route())
    })
  }

  apiError() {
    const {app} = this
    // App.get('/', (req, res) => {
    //   debug('Got error a / request')
    //   res.send('from error\n')
    // })
    // Error handlers
    app.use(fourOhFour)
    app.use(logErrors)
    app.use(clientErrorHandler)
    app.use(errorHandler)

    function logErrors(err, req, res, next) {
      if (!err) {
        return next()
      }

      debug(`Error name: ${err.name} message: ${err.message}`)
      next(err)
    }

    function clientErrorHandler(err, req, res, next) {
      next(err)
      // Or add custom handlers
      // import {AssignmentMismatchError, ParameterError, SystemError} from '../utils/errors'
      // if (err.name === AssignmentMismatchError.NAME()) {
      //   let url = config.clientUrl + '/assignments-listing?user=' + req.user._id
      //   url += '&error=' + err.message
      //   res.redirect(url)
      // } else {
      //   next(err)
      // }
    }

    function errorHandler(err, req, res) {
      res.status(err.status || 500)
      res.send(err.message)
    }

    // Catch 404 and forward to error handler
    function fourOhFour(req, res) {
      const {url} = req
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
      const env = process.env.NODE_ENV
      if (url.includes('favicon')) {
        debug('Another request for the favicon')
        res.status(404).send('No favicon')
      } else {
        const msg =
          'Could not find "' + fullUrl + '". Environment: ' + env + '\n\n'
        debug(msg)
        res.status(404).send(msg)
      }
    }
  }

  _setupSession() {
    const {app, config} = this
    const fileStoreOptions = {}
    if (config.sessionPath) {
      fileStoreOptions.path = config.sessionPath
    }

    if (config.sessionTTL) {
      fileStoreOptions.ttl = config.sessionTTL
    }

    app.sessionStore = new FileStore(fileStoreOptions)
    app.use(
      session({
        genid: () => {
          // Debug('Inside the session middleware req.sessionID ' + req.sessionID)
          return uuid()
        },
        cookie: {sameSite: 'lax'},
        store: app.sessionStore,
        secret: config.cookieSecret,
        resave: false,
        saveUninitialized: false
      })
    )
  }

  _setupCors() {
    const {config} = this
    const whitelist = [] // 'http://localhost:28000', 'http://localhost:27000']
    whitelist.push(config.clientUrl)
    whitelist.push(config.apiUrl)
    return function(req, callback) {
      const corsOptions = {origin: false} // Disable CORS by default
      if (whitelist.indexOf(req.header('Origin')) >= 0) {
        corsOptions.origin = true // Reflect (enable) the requested origin in the CORS response
      }

      callback(null, corsOptions) // Callback expects two parameters: error and options
    }
  }

  _seeding() {
    const {config} = this
    return Promise.resolve()
      .then(() => {
        if (config.seedDB) {
          debug('seeding')
          return dbSeeder()
        }
      })
      .then(() => {
        if (config.seedDB) {
          debug('seeding done')
        }
      })
  }

  _setupTrace() {
    const {app, config} = this
    config.traceApiCalls = true
    debug('Tracing ?', config.traceApiCalls)
    if (config.traceApiCalls) {
      app.use((req, res, next) => {
        debug(
          'Starting %o method: %s, url %s',
          moment().format('YYYY/MM/DD, h:mm:ss.SSS a'),
          req.method,
          req.url
        )
        next()
      })
    }
  }
}
