const knex = require("knex");
const dbPath = "db/db.sqlite";

// Exports the knex database connection object.
module.exports = knex({
  client: "sqlite",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});
