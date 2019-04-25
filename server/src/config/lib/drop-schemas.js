'use strict'
import mongoose from '../../core/mongoose'

const debug = require('debug')('server')

const schemas = ['users']

export default function(doDrop) {
  return new Promise((resolve, reject) => {
    if (!doDrop) {
      return resolve(true)
    }

    debug('Warning:  Dropping Schemas !!!')
    const allDropPromises = schemas.map(schemaName => {
      return dropSchema(schemaName)
    })
    Promise.all(allDropPromises).then(resolve, reject)
  })
}

function dropSchema(name) {
  return new Promise(resolve => {
    const col = mongoose.connection.collections[name]
    if (col) {
      col.drop((/* err */) => {
        //
        // do not care about errors
        //
        resolve(true)
      })
    }
  })
}
