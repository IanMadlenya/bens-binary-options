import { db } from './knex'
import pusher from './pusher'
import { subscribed } from './channels'

import { assets } from './assets'

function generateOffer(asset) {
  return {
    //asset: asset.name
    //token: hash(),
    uid: 123,
    strike: asset.tick(),
    payout: asset.payouts()
  }
}

export function tick() {
 
  Object.keys(assets).forEach(name => {
    const asset = assets[name]
    let offer = generateOffer(asset)
    if (subscribed[asset]) {
      console.log('pushing to pusher')
      pusher.trigger('EUR_GBP', 'tick', offer)
  }
  })
  
}

export const createOption = async function (asset, user, strikePrice, amount, payout, duration, type ) {
  
   return db.transaction(async function(trx) {
      
      try {
        // check the user has sufficient available funds
        const userCredit = await checkAmount(trx, 'credit_account', user)
            
        const userDebit = await checkAmount(trx, 'debit_account', user)
      
        console.log('balance:' + (userCredit - userDebit))
            
        if ((userCredit - userDebit) - amount <= 0) {
          throw new Error('Insufficient user funds')
        }
        
        // check the platform has sufficient available funds to meet payout
        const platformCredit = await checkAmount(trx, 'credit_account', 'platform')
              
        const platformDebit = await checkAmount(trx, 'debit_account', 'platform')
      
        if ((platformCredit - platformDebit) - (amount + payout) <= 0) {
          throw new Error('Insufficient platform funds')
        }
        
       // create the actual option
        const option = await trx.insert({
            asset: asset,
            expires_at: db.raw('(current_timestamp + (? ||\' minutes\')::INTERVAL)',[duration]),
            strike_price: strikePrice,
            amount: amount,
            user: user,
            type: type
          })
          .into('options')
          .returning('*')
          .then(result => result[0])
      
        // move the user's money to pending
        const userDeposit = await payment(trx, 'pending', user, amount, `Deposit for option ${option.id}`)
        
        // move the platform's money to pending
        const platformDeposit = await payment(trx, 'pending', 'platform', amount, `Deposit for option ${option.id}`)
        
      } catch(err) {
        console.log(err)
        throw err
      }
    })

}



export const settle = async function () {
    
  try {
    // looks for options that have expired but not settled:
    const options = await db.select('*')
      .from('options')
      .where('expires_at', '<', new Date())
      .andWhere('settled', false)
      
     // loop over the open options
     for (let o of options) {
     
      db.transaction(async function(trx) {
        try {
          // find what price the asset was, at the option expiry time
          const asset = await trx.select('price').from('prices').where({ asset: o.asset }).andWhere('timestamp', '<', o.expires_at).first()
        
          // throw if there's no expiry time found
          if (!asset) {
            throw new Error('Asset price not found')
          }
          console.log(asset.price)
          console.log(o.strike_price)
          // was the option in the money or not?
          if (asset.price < o.strike_price) {
            console.log('in the money')
          } else {
            console.log('outside')
          }
          
            /*
     if in the money
    - move money from pending to user
    - move money from house to user
    
    if not
    - move money from pending to house
    */
          
        } catch (err) {
          console.log(err)
        }

      })

     }
  } catch (err) {
    console.log(err)
    return err
  }
  
}