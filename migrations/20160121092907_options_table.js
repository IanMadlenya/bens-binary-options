
exports.up = function(knex, Promise) {

  return knex.schema.createTable('options', function(t) {
		t.increments();
    t.timestamp('timestamp').default(knex.raw('now()'))
    t.timestamp('expires_at')
    t.string('user').notNullable()
    t.string('asset').notNullable()
    t.specificType('amount', 'NUMERIC (20,2)').notNullable()
    t.specificType('strike_price', 'NUMERIC (20,2)').notNullable()
    t.specificType('expiry_price', 'NUMERIC (20,2)')
    t.integer('payout').notNullable()
    t.enu('type', ['put', 'call']).notNullable()
    t.boolean('outcome') // true - in money, false - out of money
    t.boolean('settled').defaultTo(false)
    
  })
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('options')
};
