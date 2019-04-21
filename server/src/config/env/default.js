'use strict'

const pkg = require('../../../package.json')
const KEYWORDS = pkg.keywords.join(',')
const TITLE = pkg.title
const DESCRIPTION = pkg.description
const API_PORT = process.env.API_PORT
const MONGODB_PORT = process.env.MONGODB_PORT
const MONGODB_HOST = process.env.MONGODB_HOST
const MONGODB_DEBUG = process.env.MONGODB_DEBUG || false
const MONGODB_NAME = process.env.MONGODB_NAME
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'this is the secret for the session cookie'
const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PWORD = process.env.MONGODB_PWORD


module.exports = {
  app: {
    title: TITLE,
    description: DESCRIPTION,
    keywords: KEYWORDS
  },
  cookieSecret: COOKIE_SECRET,
  port: API_PORT,


  database: {
    name: MONGODB_NAME,
    host: MONGODB_HOST,
    port: MONGODB_PORT,
    user: MONGODB_USER,
    password: MONGODB_PWORD,
    options: {
      useNewUrlParser: true,
      useCreateIndex: true
    },
    debug: MONGODB_DEBUG
  },

  // TODO add email support ....
  mailer: {
    enabled: false, // change this flag to true to turn emailing feature on.

    //if enabled = true make sure to configure one of the methods below
    from: 'noreply@app.com'
    /*
    transport: "smtp",
    smtp: {
      host: "mailtrap.io",
      port: 2525,
      auth: {
        user: "",
        pass: ""
      }
    }*/

    /*transport: "smtp",
    smtp: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "",
        pass: ""
      }
    }*/

    /*
    transport: "mailgun",
    mailgun: {
      apiKey: '',
      domain: ''
    }*/

    /*
    transport: "sendgrid",
    sendgrid: {
      apiKey: ""
    }*/
  },

}

