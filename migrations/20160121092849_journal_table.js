
exports.up = function(knex, Promise) {
  return knex.schema.createTable('ledger', function(t) {
		t.increments();
    t.timestamp('timestamp').default(knex.raw('now()'))
    t.string('description')
		t.string('debit_account').notNullable()
    t.string('credit_account').notNullable()
    t.specificType('amount', 'NUMERIC (20,2)').notNullable() //.raw('CHECK (amount > 0.0)')
    
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('ledger')
};
