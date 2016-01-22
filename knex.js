var config = require('./knexfile')[process.env.NODE_ENV]

export const db = require('knex')(config)
