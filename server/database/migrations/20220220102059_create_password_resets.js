/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('password_resets')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('password_resets', function(table) {
          table.string('email', 255).index().notNullable();
          table.string('token', 255).notNullable();
          table.timestamp('created_at').defaultTo(knex.fn.now())
        })
          .then(() => console.log('created password_resets table'))
      }
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.hasTable('password_resets')
    .then((exists) => {
      if (exists) {
        return knex.schema.dropTable('password_resets')
          .then(() => console.log('dropped password_resets table'))
      }
    })
};
