'use strict'
import Config from '../config/config'
import App from './app'

const debug = require('debug')('server')

initUnhandled()

const config = new Config(process.env.NODE_ENV)
const app = new App()

const configuration = config.config
app
  .setup(configuration)
  .then(() => {
    const {port} = configuration
    app.application.listen(port, () => {
      debug('Server running...' + port)
    })
  })
  .catch(error => {
    debug('Error starting server %o', error)
  })

function initUnhandled() {
  /*
  Define application wide handlers for unhandled exceptions and rejections.
  See https://nodejs.org/api/process.html#process_event_unhandledrejection
   */
  if (process.listeners('unhandledRejection') < 2) {
    process.on('unhandledRejection', error => {
      debug('-=-=-=-=-= UNHANDLED REJECTION %s %O', error, error.stack)
    })
  }

  if (process.listeners('uncaughtException') < 2) {
    process.on('uncaughtException', error => {
      debug('.-.-.-.-.-. UNCAUGHT EXCEPTION %s %O', error, error.stack)
    })
  }
}
