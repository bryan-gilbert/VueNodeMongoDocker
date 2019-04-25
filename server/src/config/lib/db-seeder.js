import SeedlingsController from '../../controllers/seedlings-controller'
import dropSchemas from './drop-schemas'

const SeedlingModel = new SeedlingsController()
const debug = require('debug')('server')

// =========================================================================
//
// !!!! IMPORTANT !!!!
//
// This will drop schemas first if set to true
//
// =========================================================================
const DROP_SCHEMAS = true

if (DROP_SCHEMAS) {
  debug('Warning:  Droping all schemas')
  dropSchemas(DROP_SCHEMAS)
}

// =========================================================================
//
// This will force all integrations if set to true
//
// =========================================================================
const FORCE = false

// -------------------------------------------------------------------------
//
// check if the database seeding was performed, can override
//
// -------------------------------------------------------------------------
const checkIntegration = function(name, override) {
  return new Promise(resolve => {
    if (override) {
      return resolve(true)
    }

    return SeedlingModel.findOne({module: name})
      .then(row => {
        if (row) {
          return resolve(false)
        }

        SeedlingModel.create({module: name}).then(() => {
          resolve(true)
        })
      })
      .catch(error => {
        debug('Error seeding ' + name + ' : %o', error)
      })
  })
}

function doIntegrations() {
  return (
    checkIntegration('users', false)
      .then(go => {
        if (go) {
          return true
          // Return require('../seed-data/user-seeds')(true)
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
      .catch(error => {
        debug('Error in doIntegrations %o', error)
      })
  )
}

export default function(forceSeeding) {
  debug('Warning:  Seeding database')
  const f = forceSeeding ? forceSeeding : FORCE
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
