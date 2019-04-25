'use strict'
const fs = require('fs')
const path = require('path')
const debug = require('debug')('server')

const DEVELOPMENT = 'development'

export default class Config {
  constructor(env) {
    this.env = env
    if (!this.env) {
      this.env = DEVELOPMENT
      debug(
        'Error: NODE_ENV is not defined! Using default development environment'
      )
    }

    const cwd = path.join(process.cwd(), 'src/config/env')
    const defaultPath = path.join(cwd, 'default')
    let envPath = path.join(cwd, this.env)

    if (!fs.existsSync(envPath)) {
      debug('Error: no config file for %s. Use development ')
      this.env = DEVELOPMENT
      envPath = path.join(cwd, this.env)
    }

    // Load the config
    const defaultConfig = require(defaultPath)
    const environmentConfig = require(envPath)
    debug('importing config for the %s environment', this.env)

    // Merge config files
    this.configuration = Object.assign(defaultConfig, environmentConfig)

    // Validate Secure SSL mode can be used
    Config.validateSecureMode(this.configuration)

    debug('configuration ready %s', this.asStringForLog())
  }

  get config() {
    return this.configuration
  }

  asStringForLog() {
    let tmp = {}
    try {
      tmp = JSON.parse(JSON.stringify(this.configuration))
    } catch (error) {
      debug('Error cloning configuration %o', error)
    }

    tmp.database.password = 'sanitizedFor2'
    return JSON.stringify(tmp)
  }

  /**
   * Validate Secure=true parameter can actually be turned on
   * because it requires certs and key files to be available
   */
  static validateSecureMode(config) {
    if (!config.secure || config.secure.ssl !== true) {
      return true
    }

    const privateKey = fs.existsSync(path.resolve(config.secure.privateKey))
    const certificate = fs.existsSync(path.resolve(config.secure.certificate))

    if (!privateKey || !certificate) {
      debug(
        'Error: Certificate file or key file is missing, falling back to non-SSL mode'
      )
      debug(
        'To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'
      )
      config.secure.ssl = false
    }
  }
}
