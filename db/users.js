// Functions for manipulating the users table.
const knex = require("./knex");
const bcrypt = require("bcrypt");
const SALT = 10;

/**
 *
 * Attempts to create a new user in the database.
 *
 * @param {string} first_name The first name of the user.
 * @param {string} last_name The user's last name.
 * @param {string} email The email of the user to create.
 * @param {string} password The password to be hashed and stored in the db.
 * @returns {Promise<object | null>} Promise of the user object if the user was successfully created, or null if the user could not be created.
 */
const createUser = async (first_name, last_name, email, password) => {
  // Make sure params are not 0-length strings
  if (
    first_name.length === 0 ||
    last_name.length === 0 ||
    email.length === 0 ||
    password.length === 0
  ) {
    return null;
  }

  const result = await knex("users")
    .insert(
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(SALT)),
        settings: JSON.stringify(require("./defaultSettings")),
      },
      ["id", "first_name", "last_name", "email", "password", "settings"]
    )
    .catch((err) => {
      console.log(err);
    });

  return result ? result[0] : null;
};

/**
 *
 * Attempts to get a user from the database by their email.
 *
 * @param {string} email The email of the user to get.
 * @returns {Promise<object | null>} Promise of the user object if the user
 * was found, or null if the user was not found.
 */
const getUser = async (email) => {
  const result = await knex("users")
    .select("*")
    .where("email", email)
    .catch((err) => {
      console.log(err);
    });

  return result && result[0] ? result[0] : null;
};

/**
 *
 * Attempts to update the settings for a user in the database by their email.
 *
 * @param {string} email The email of the user to update.
 * @param {object} settings The settings object to be stored in the db.
 * @returns {Promise<boolean>} Promise of true or false depending on whether
 *  the update was successful.
 */
const updateSettings = async (email, settings) => {
  return !!(
    await knex("users")
      .where("email", email)
      .update({ settings: JSON.stringify(settings) }, ["settings"])
      .catch((err) => {
        console.log(err);
      })
  )[0];
};

/**
 *
 * Attempts to update the name for a user in the database by their email.
 *
 * @param {string} email The email of the user to update.
 * @param {string} first_name The first name of the user.
 * @param {string} last_name The user's last name.
 * @returns {Promise<boolean>} Promise of true or false depending on whether
 *  the update was successful.
 */
const updateName = async (email, first_name, last_name) => {
  return !!(
    await knex("users")
      .where("email", email)
      .update({ first_name, last_name }, ["first_name", "last_name"])
      .catch((err) => {
        console.log(err);
      })
  )[0];
};

/**
 *
 * Attempts to delete a user and their card entries in the database.
 *
 * @param {integer} id The id of the user to delete.
 * @returns {Promise<boolean>} Promise of true if the user_account was
 * successfully deleted, or false if the user_account could not be deleted.
 */
const deleteUser = async (id) => {
  // This line enables the foreign key constraint to cascade deletions.
  await knex.raw("PRAGMA foreign_keys = ON");

  // Simply delete the user_account entry with the given ID.
  return (
    (await knex("users")
      .where("id", id)
      .del()
      .catch((err) => {
        console.log(err);
      })) > 0
  );
};

module.exports = {
  createUser,
  getUser,
  updateSettings,
  updateName,
  deleteUser,
};
