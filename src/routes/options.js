import Joi from 'joi'
import Boom from 'boom'
import { db } from '../knex'
import { createOption } from '../settlement'

module.exports = {
  method: 'POST',
  path: '/api/options',
  handler: async function (request, reply) {
    
    const { user, asset, price, amount, duration, payoutOffer, type } = request.payload
    
    const payout = amount * (1 + payoutOffer)
    
    try {
      const option = await createOption(asset, user, price, amount, payout, duration, type)
      reply(option)
    } catch(err) {
      // By default, Hapi throws 500 status code. We can coerce this into 400.
      if (err.message === 'Insufficient user funds' || err.message === 'Insufficient platform funds') {     
        reply(Boom.badRequest(err))
      }
      
      reply(err)
      
    }
  
  },
  config: {
    description: 'Submit new option',
    validate: {
      payload: {
        //token: Joi.string().required(),
        user: Joi.string().required(),
        asset: Joi.string().required(),
        price: Joi.string().required(),
        amount: Joi.number().required(),
        type: Joi.string().required(), // enum - put or call
        payout_offer: Joi.number().required(),
        duration: Joi.number().required()
      }
    }
  }
}

