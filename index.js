require("babel-core/register")
require("babel-polyfill")

import Hapi from 'hapi'
import { settle, tick, createOption, payment } from './settlement'

//setInterval(tick, 2000)
//setInterval(settle, (1000))

import { db } from './knex'
/*
payment(db, 'bob', 'external_funding', 1000, 'Initial deposit').then(res => {
  console.log(res)
})

createOption('haribo', 'bob',50, 1, 2).then((res) => {
  console.log(res)
})
*/
const server = new Hapi.Server()

server.connection({ port: 8080 })

server.route(require('./routes/webhooks'))
server.route(require('./routes/assets'))
server.route(require('./routes/ledger'))
server.route(require('./routes/options'))

server.start(err => {
 if (err) {
   console.log('server failed to start')
 }
 console.log('started')
})


/*
first journal entry will be money into the house:
from: bank (external) to house (main) - in seed


component
- onMount - connect to pusher
- pull history from api
- render graph (react chat thing)
- update on each update


*/
/*
generate token as a JWT, to get security and expiry date

to actually buy the option, send the token and the wager
token will expiry in one min using the iat



also move the house stake to pending!

if not available, reject

TABLES:
users
accounts (one for every user, plus house-pending, house-settled)
journal
options
 - asset_name
 - strike_price
 - direction (higher or lower)/ put or call
 - expiry_time
 - settled(true/false)
 - expiry_price
historical prices
- asset
- timestamp
- price

options_transactions
option_id, journal_id


store:
balance? - could reduce over the trades
trades - pending, success
entities:
currencyPairs: {
  dollar-eur: [{ time: bid: ask: }]
}

calculate strike price by currencyPairs[currentCurrency][0]
- but how to price?? random?!

web socket:
currency pair
bid
ask
mid
strike
timestamp
payout: 
  time duration: %
hash


*/