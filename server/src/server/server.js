'use strict'
import Config from '../config/config'
import App from './app'
import Prose from '../proseMirror/prose'

const debug = require('debug')('server')

initUnhandled()

const {config} = new Config(process.env.NODE_ENV)
const app = new App()

app
  .setup(config)
  .then(() => {
    const {port} = config
    let server = app.application.listen(port, () => {
      debug('Server running...' + port)
    })
    const io = require('socket.io')(server)
    app.prose = new Prose(app, config, io)

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
