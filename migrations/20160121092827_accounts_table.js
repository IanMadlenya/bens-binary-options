exports.up = function(knex, Promise) {
 return knex.schema.createTable('accounts', function(t) {
		t.increments();
		t.string('name').unique()
 })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('accounts')
};
