exports.up = function(knex, Promise) {
  return knex.schema.createTable("notes", function(table) {
    // chave primária
    table.increments("oid");

    // estrutura
    table.string("title", 50).notNullable();
    table.string("description", 250).notNullable();
    table.date("date").notNullable();
    table.boolean("done");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("notes");
};
