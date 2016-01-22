'use strict'
import { db }from './knex'

// Fake asset to trade
export class Asset {
  constructor(name, displayName, startingPrice, volatility) {
    this.name = name
    this.price = startingPrice
    this.vol = volatility
    this.displayName = displayName
  }
  
  tick() {
    // calculates a new price and returns it
    let change_percent = 2 * this.vol * Math.random()
    
    const time = new Date()
    
    if (change_percent > this.vol) {
      change_percent -= (2 * this.vol);
    } 
    
    let change_amount = this.price * change_percent;
    this.price += change_amount;
    //knex.insert
    db.into('prices').insert({ timestamp: time, price: this.price, asset: this.name }).then(res => {
      console.log('===logged===')
      return this.price
    })
    
  }
  
  payouts() {
    // calculates a payout, based on volatility and time
    return {
      60: 0.85 * (100 - (this.vol * Math.random()))
    }
    
  }
  
}