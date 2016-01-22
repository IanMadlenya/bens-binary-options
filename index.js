require("babel-core/register")
require("babel-polyfill")

import Hapi from 'hapi'
import { settle, tick, createOption, payment } from './src/settlement'

setInterval(tick, 2000)
setInterval(settle, (1000))

import { db } from './knex'

const server = new Hapi.Server()

server.connection({ port: 8080 })

server.route(require('./src/routes/webhooks'))
server.route(require('./src/routes/assets'))
server.route(require('./src/routes/ledger'))
server.route(require('./src/routes/options'))

server.start(err => {
 if (err) {
   console.log('server failed to start')
 }
 console.log('started')
})
