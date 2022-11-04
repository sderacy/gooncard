// Functions for manipulating the user_accounts table.
const knex = require("./knex");
const { getUser } = require("./users");

/**
 *
 * Attempts to create a new user_account in the database.
 *
 * @param {string} email The email of the user to create the account for.
 * @param {string} label The label of the account.
 * @param {string} value The value of the account.
 * @param {number} type The type of the account.
 * @returns {Promise<object | null>} Promise of the user_account object if
 * the user_account was successfully created, or null if the user_account
 * could not be created.
 */
const createUserAccount = async (email, label, value, type) => {
  // Get the ID of the user with the given email.
  const user = await getUser(email);

  // Return null if the user could not be found.
  if (!user) {
    console.log("User not found.");
    return null;
  }

  // Otherwise, use the user's ID to create the user_account.
  const userId = user.id;

  // Insert the new user account into the database using the user's ID.
  const result = await knex("user_accounts")
    .insert(
      {
        user_id: userId,
        label: label,
        value: value,
        type: type,
      },
      ["id", "user_id", "label", "value", "type"]
    )
    .catch((err) => {
      console.log(err);
    });

  return result ? result[0] : null;
};

const getUserAccounts = async (email) => {};

const updateUserAccount = async (userAccountId, label, value, type) => {};

const deleteUserAccount = async (userAccountId) => {};

module.exports = {
  createUserAccount,
  getUserAccounts,
  updateUserAccount,
  deleteUserAccount,
};
