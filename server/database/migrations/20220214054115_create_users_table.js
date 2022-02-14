/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.hasTable('users')
    .then((exists) => {
      if (!exists) {
        return knex.schema.createTable('users', function(table) {
          table.bigIncrements();
          table.string('first_name', 45).notNullable();
          table.string('last_name', 45);
          table.string('email', 255).notNullable().unique();
          table.string('password', 255).notNullable();
          table.timestamp('deleted_at');
          table.timestamp('verified_at');
          table.timestamps();
        })
          .then(() => console.log('users table created'))
      }
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.hasTable('users')
    .then((exists) => {
      if (exists) {
        return knex.schema.dropTable('users')
          .then(() => console.log('users table dropped'))
      }
    })
};
