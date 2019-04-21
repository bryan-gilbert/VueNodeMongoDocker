import SeedlingsController from '../../controllers/seedlings-controller'
const SeedlingModel = new SeedlingsController()
const debug = require('debug')('server')

var chalk = require('chalk')
console.log(chalk.bold.red('Warning:  Database seeding is turned on'))

// =========================================================================
//
// !!!! IMPORTANT !!!!
//
// This will drop schemas first if set to true
//
// =========================================================================
var DROP_SCHEMAS = false

if (DROP_SCHEMAS) {
  require('../seed-data/dropschemas')(DROP_SCHEMAS)
}

// =========================================================================
//
// This will force all integrations if set to true
//
// =========================================================================
var FORCE = false

// -------------------------------------------------------------------------
//
// check if the database seeding was performed, can override
//
// -------------------------------------------------------------------------
var checkIntegration = function (name, override) {
  return new Promise(function (resolve /* reject */) {
    if (override) return resolve(true)
    return SeedlingModel.findOne({ module: name })
      .then(row => {
        if (row) {
          return resolve(false)
        }
        SeedlingModel.create({ module: name }).then(integration => {
          resolve(true)
        })
      })
      .catch(err => {
        console.error('Error seeding ' + name + ' : ', err)
      })
  })
}

function doIntegrations () {
  return checkIntegration('users', false)
    .then(go => {
      if (go) {
        return require('../seed-data/user-seeds')(true)
      }
    })
    // .then(() => {
    //   return checkIntegration('ehrseed')
    // })
    // .then(go => {
    //   debug('Seed ehr seed data? ', go)
    //   if (go) {
    //     return require('../seed-data/ehrSeeds')(true)
    //   }
    // })
    .then(() => {
      debug('DONE integrations')
    })
    .catch(err => {
      console.error(err)
    })

  // =========================================================================
  //
  // Things in this section are split into production and non-production
  //
  // =========================================================================
  if (process.env.NODE_ENV === 'production') {
    // -------------------------------------------------------------------------
    //
    // add production admin user
    //
    // -------------------------------------------------------------------------
    // require('../seed-data/users-production')()
  } else {
    // -------------------------------------------------------------------------
    //
    // add non-production test user accounts
    //
    // -------------------------------------------------------------------------
    // require('../seed-data/users-other')()
    // -------------------------------------------------------------------------
  }
}
export default function (forceSeeding) {
  let f = forceSeeding ? forceSeeding : FORCE
  return Promise.resolve()
    .then(() => {
      if (f) {
        return SeedlingModel.clearAll()
      }
    })
    .then(() => {
      return doIntegrations()
    })
}
