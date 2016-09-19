
exports.up = function(knex, Promise) {
  return knex.schema.createTable('post_tbl', function(table){
    table.increments()
    table.string('title')
    table.text('content')
    table.text('author')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('post_tbl')
};
