import Joi from 'joi'
import { db } from '../knex'

module.exports = {
  method: 'GET',
  path: '/api/assets/{id}',
  handler: async function (request, reply) {
    
    try {
      
      const prices = await db.table('prices')
        .select('*')
        .orderBy('timestamp')
        .where({
          asset: request.params.id
        })
        
      reply(prices || [])
      
    } catch(err) {
      console.log(err)
      reply(err)
    }
 
  },
  config: {
    description: 'Returns historical asset prices',
    validate: {
      params: {
        id: Joi.string()
      }
      //query: {
       // from: Joi.string().default()
        //to: J
      //}
    }
  }
}

