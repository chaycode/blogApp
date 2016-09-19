
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comment_tbl', function(table){
    table.increments()
    table.string('comment')
    table.string('username')
    table.integer('post_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comment_tbl')
};
