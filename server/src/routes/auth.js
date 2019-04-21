'use strict'
/*
NOT USED .. here as sample code that may be inspirational
 */
let config   = require('../config')
let logger   = require('../core/logger')

let crypto   = require('crypto')
let async    = require('async')

let passport  = require('passport')
let express   = require('express')

let mailer    = require('../libs/mailer')
let User      = require('../models/user')
let Response  = require('../core/response')

/**
 *
 * @param  {Object} req      request object
 * @param  {Object} res      response object
 * @param  {String} redirect redirect site URL.
 * @param  {Object} err      Error object.
 */
function respond (req, res, redirect, err) {
  if (redirect) {
    // Redirect to the original url
    if (req.session.returnTo) {
      redirect = req.session.returnTo
      delete req.session.returnTo
    }
    res.redirect(redirect)
  }
}

function sendResetEmailToUser (token, user, done) {
  if (!config.mailer.enabled) {
    const err = 'Trying to send email without config.mailer not enabled; emailing skipped. Have you configured mailer yet?'
    logger.error(err)
    return done(err, user)
  }
  let subject = req.t('mailSubjectLogin', config)

  res.render('mail/passwordLessLogin', {
    name: user.fullName,
    loginLink: 'http://' + req.headers.host + '/passwordless/' + token
  }, function (err, html) {
    if (err)
      return done(err)

    mailer.send(user.email, subject, html, function (err, info) {
      if (err)
        req.flash('error', { msg: req.t('UnableToSendEmail', user) })
      else
        req.flash('info', { msg: req.t('emailSentWithMagicLink', user) })

      done(err)
    })
  })
}

module.exports = function (app, db) {

  let authRouter = express.Router()

  authRouter.post('/local', function (req, res, next) {

    req.assert('username', req.t('UsernameCannotBeEmpty')).notEmpty()

    let errors = req.validationErrors()
    if (errors) {
      return respond(req, res, '/login', Response.BAD_REQUEST)
    }

    if (req.body.password) {
      // Login with password
      passport.authenticate('local', function (err, user, info) {
        if (!user) {
          // req.flash('error', { msg: info.message })
          return respond(req, res, '/login', Response.BAD_REQUEST)
        }

        req.login(user, function (err) {
          if (err) {
            // req.flash('error', { msg: err })
            return respond(req, res, '/login', Response.BAD_REQUEST)
          }

          // Success authentication
          // Update user's record with login time
          req.user.lastLogin = Date.now()
          req.user.save(function () {
            // Remove sensitive data before login
            req.user.password = undefined
            req.user.salt = undefined

            respond(req, res, '/')
          })
        })
      })(req, res, next)
    }
  })

  // Add router to app
  app.use('/auth', authRouter)
}
