import { db } from '../knex'

module.exports = {
  method: 'GET',
  path: '/api/ledger',
  handler: async function (request, reply) {
    
    try {
      
      const entries = await db.table('ledger')
        .select('*')
        .orderBy('timestamp')
        
      reply(entries || [])
      
    } catch(err) {
      console.log(err)
      reply(err)
    }
 
  },
  config: {
    description: 'Returns all ledger entries'
  }
}

