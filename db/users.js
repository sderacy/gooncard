// Functions for manipulating the users table
const knex = require("./knex");
const DEFAULT_SETTINGS = {
  theme: "light",
  fontSize: "12px",
  fontFamily: "sans-serif",
};

// Creates a new user in the database. Returns an array of a single value,
// either the user object or a falsey value if the user could not be created.
const createUser = async (first_name, last_name, email, password) => {
  // Make sure params are not 0-length strings
  if (
    first_name.length === 0 ||
    last_name.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    return [undefined];
  }

  return await knex("users")
    .insert(
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        settings: JSON.stringify(DEFAULT_SETTINGS),
      },
      ["first_name", "last_name", "email", "password", "settings"]
    )
    .catch((err) => {
      console.log(err);
    });
};

// Gets a user from the database. Returns an array of a single value,
// either the user object or a falsey value if the user could not be found.
const getUser = async (email) => {
  return await knex("users")
    .select("*")
    .where("email", email)
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { createUser, getUser };
