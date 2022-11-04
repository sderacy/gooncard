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

/**
 *
 * Attempts to find all user_accounts for a given user.
 *
 * @param {string} email The email of the user to get the accounts for.
 * @returns {Promise<object[] | null>} Promise of the user_account objects if
 * the user_accounts were successfully found, or null if the user_accounts
 * could not be found.
 */
const getUserAccounts = async (email) => {
  // Get the ID of the user with the given email.
  const user = await getUser(email);

  // Return null if the user could not be found.
  if (!user) {
    return null;
  }

  // Otherwise, use the user's ID to find all associated user_account entries.
  const userId = user.id;

  // Find all user_accounts associated with the user's ID.
  const result = await knex("user_accounts")
    .select("*")
    .where("user_id", userId)
    .catch((err) => {
      console.log(err);
    });

  return result.length > 0 ? result : null;
};

/**
 *
 * Attempts to update a user_account in the database.
 *
 * @param {number} userAccountId The ID of the user_account to update.
 * @param {string} label The new label of the account.
 * @param {string} value The new value of the account.
 * @param {number} type The new type of the account.
 * @returns {Promise<boolean>} Promise of true if the user_account was
 * successfully updated, or false if the user_account could not be updated.
 */
const updateUserAccount = async (userAccountId, label, value, type) => {
  // Simply update the user_account entry with the given ID.
  return !!(
    await knex("user_accounts")
      .where("id", userAccountId)
      .update(
        {
          label: label,
          value: value,
          type: type,
        },
        ["id", "user_id", "label", "value", "type"]
      )
      .catch((err) => {
        console.log(err);
      })
  )[0];
};

/**
 *
 * Attempts to delete a user_account in the database.
 *
 * @param {number} userAccountId The ID of the user_account to delete.
 * @returns {Promise<boolean>} Promise of true if the user_account was
 * successfully deleted, or false if the user_account could not be deleted.
 */
const deleteUserAccount = async (userAccountId) => {
  // Simply delete the user_account entry with the given ID.
  return (
    (await knex("user_accounts")
      .where("id", userAccountId)
      .del()
      .catch((err) => {
        console.log(err);
      })) > 0
  );
};

module.exports = {
  createUserAccount,
  getUserAccounts,
  updateUserAccount,
  deleteUserAccount,
};
