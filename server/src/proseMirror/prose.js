import fs from 'fs'
import { Step } from 'prosemirror-transform'
import schema from './schema.js'
const path = require('path')

// setup socket server
// https://stackoverflow.com/questions/38062689/how-do-i-get-the-http-server-from-the-express-app
// const app = require('express')()
// const http = require('http').Server(app)
// const io = require('socket.io')(http)
// http.listen(3000)
const dbl0=true
const dbl1=true
const dbl2=false

// setup socket server
// https://stackoverflow.com/questions/38062689/how-do-i-get-the-http-server-from-the-express-app
// const app = require('express')()
// const http = require('http').Server(app)
// const io = require('socket.io')(http)
// http.listen(3000)
// if(dbl0) console.log("listening on 3000")


// options
const simulateSlowServerDelay = 0 // milliseconds
// const docPath = './db.json'
const docPath = path.join(process.cwd(), 'db.json')
// const lockedPath = './db_locked.json'
const lockedPath = path.join(process.cwd(), 'db_locked.json')
// const stepsPath = './db_steps.json'
const stepsPath = path.join(process.cwd(), 'db_steps.json')

fs.readdir(process.cwd(), (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

const maxStoredSteps = 1000
const defaultData = {
  "version": 0,
  "doc": { "type": "doc", "content": [{ "type": "paragraph", "content":[{ "type": "text", "text": "Let's start collaborating. Yeah!" }] }] }
}

const sleep = (ms) => (new Promise(resolve => setTimeout(resolve, ms)));

function storeDoc(data) {
  if(dbl1) console.log('storeDoc', data)

  fs.writeFileSync(docPath, JSON.stringify(data, null, 2))
}

function storeSteps({steps, version}) {
  const oldData = JSON.parse(fs.readFileSync(stepsPath, 'utf8'))
  const limitedOldData = oldData.slice(Math.max(oldData.length - maxStoredSteps))

  const newData = [
    ...limitedOldData,
    ...steps.map((step, index) => {
      return {
        step: JSON.parse(JSON.stringify(step)),
        version: version + index + 1,
        clientID: step.clientID,
      }
    })
  ]

  fs.writeFileSync(stepsPath, JSON.stringify(newData))
}

function storeLocked(locked) {
  fs.writeFileSync(lockedPath, locked.toString())
}

function getDoc() {
  try {
    return JSON.parse(fs.readFileSync(docPath, 'utf8'))
  } catch(e) {
    return defaultData
  }
}

function getLocked() {
  return JSON.parse(fs.readFileSync(lockedPath, 'utf8'))
}

function getSteps(version) {
  try {
    const steps = JSON.parse(fs.readFileSync(stepsPath, 'utf8'))
    return steps.filter(step => step.version > version)
  } catch(e) {
    return []
  }
}


export default class Prose {
  constructor(app, config, io) {
    this.app = app
    this.config = config
    io.on('connection', socket => {
      if(dbl0) console.log('connection event')
      socket.on('update', async ({ version, clientID, steps }) => {
        if(dbl1) console.log('update event')
        // we need to check if there is another update processed
        // so we store a "locked" state
        const locked = getLocked()

        if (locked) {
          if(dbl1) console.log('update event locked. we will do nothing and wait for another client update')
          // we will do nothing and wait for another client update
          return
        }

        storeLocked(true)

        const storedData = getDoc()

        await sleep(simulateSlowServerDelay)

        // version mismatch: the stored version is newer
        // so we send all steps of this version back to the user
        if (storedData.version !== version) {
          if(dbl2) console.log('update event. version mismatch: the stored version is newer')
          socket.emit('update', {
            version,
            steps: getSteps(version),
          })
          storeLocked(false)
          return
        }

        let doc = schema.nodeFromJSON(storedData.doc)

        await sleep(simulateSlowServerDelay)

        let newSteps = steps.map(step => {
          const newStep = Step.fromJSON(schema, step)
          newStep.clientID = clientID

          // apply step to document
          let result = newStep.apply(doc)
          doc = result.doc

          return newStep
        })

        await sleep(simulateSlowServerDelay)

        // calculating a new version number is easy
        const newVersion = version + newSteps.length

        // store data
        storeSteps({ version, steps: newSteps })
        storeDoc({ version: newVersion, doc })

        await sleep(simulateSlowServerDelay)

        // send update to everyone (me and others)
        if(dbl2) console.log('update event. send update to everyone (me and others)', newVersion)
        io.sockets.emit('update', {
          version: newVersion,
          steps: getSteps(version),
        })

        storeLocked(false)
      })

      // send latest document
      socket.emit('init', getDoc())

      // send client count
      io.sockets.emit('getCount', io.engine.clientsCount)
      socket.on('disconnect', () => {
        if(dbl0) console.log('disconnect event')
        io.sockets.emit('getCount', io.engine.clientsCount)
      })
    })
  }

}
