import { Router } from 'express'
import moment from 'moment'
import cors from 'cors'
import dbSeeder from '../config/lib/dbSeeder'
import UserController from '../controllers/user-controller'

// Sessions and session cookies
// express-session stores session data here on the server and only puts session id in the cookie
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'this is the secret for the session cookie'
// session ids
const uuid = require('uuid/v4')

const debug = require('debug')('server')

export function apiMiddle (app, config) {
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
      genid: req => {
        // debug('Inside the session middleware req.sessionID ' + req.sessionID)
        return uuid()
      },
      cookie: { sameSite: 'lax' },
      store: app.sessionStore,
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: false
    })
  )

  if (config.traceApiCalls) {
    app.use(function (req, res, next) {
      debug('Starting %o method: %s, url %s', moment().format('YYYY/MM/DD, h:mm:ss.SSS a'), req.method, req.url)
      next()
    })
  }

  const corsOptions = setupCors(config)
  const user = new UserController(config)


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
    .then(() => {
      const api = Router()
      // Inside API
      api.use('/user', cors(corsOptions), user.route())
      // for use behind a proxy:
      api.use('/api/user', cors(corsOptions), user.route())
      return api
    })
}

export function apiError (app, config) {
  // error handlers
  app.use(logErrors)
  app.use(clientErrorHandler)
  app.use(errorHandler)

  function logErrors (err, req, res, next) {
    if (!err) {
      return next()
    }
    debug(`Error name: ${err.name} message: ${err.message}`)
    next(err)
  }

  function clientErrorHandler (err, req, res, next) {
    next(err)
    // or add custom handlers
    // import {AssignmentMismatchError, ParameterError, SystemError} from '../utils/errors'
    // if (err.name === AssignmentMismatchError.NAME()) {
    //   let url = config.clientUrl + '/assignments-listing?user=' + req.user._id
    //   url += '&error=' + err.message
    //   res.redirect(url)
    // } else {
    //   next(err)
    // }
  }

  function errorHandler (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
  }
}

function setupCors (config) {
  let whitelist = [] // 'http://localhost:28000', 'http://localhost:27000']
  whitelist.push(config.clientUrl)
  whitelist.push(config.apiUrl)
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  return corsOptionsDelegate
}
