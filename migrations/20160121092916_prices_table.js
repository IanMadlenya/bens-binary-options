
exports.up = function(knex, Promise) {
  return knex.schema.createTable('prices', function (t) {
    t.timestamp('timestamp')
    t.string('asset')
    t.specificType('price', 'NUMERIC (20,2)')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('prices')
};
