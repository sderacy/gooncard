// Functions for manipulating the card_entry table.
const knex = require("./knex");

/**
 *
 * Attempts to create a new card_entry in the database.
 *
 * @param {string} uuid UUID of the card_entry to create.
 * @param {integer} user_account_id ID of the user_account to add.
 * @returns {Promise<object | null>} Promise of the card_entry object if
 * the card_entry was successfully created, or null if the card_entry
 * could not be created.
 */
const createCardEntry = async (uuid, user_account_id) => {
  // Insert the new card_entry into the database using the uud and user_account_id.
  const result = await knex("card_entries")
    .insert(
      {
        uuid: uuid,
        user_account_id: user_account_id,
      },
      ["id", "uuid", "user_account_id"]
    )
    .catch((err) => {
      console.log(err);
    });

  return result ? result[0] : null;
};

/**
 *
 * Attempts to find all card_entries for a given uuid.
 *
 * @param {string} uuid UUID of the card_entry to find.
 * @returns {Promise<object[] | null>} Promise of the card_entries objects if
 * the card_entries were successfully found, or null if the card_entries
 * could not be found.
 */
const getCardEntries = async (uuid) => {
  // Find all card_entries associated with the user's account ID.
  const result = await knex("card_entries")
    .select("*")
    .where("uuid", uuid)
    .catch((err) => {
      console.log(err);
    });

  return result.length > 0 ? result : null;
};

const getUserData = async (uuid) => {
  // Find just a user_account ID associated with the given uuid.
  let result = await knex("card_entries")
    .select("user_account_id")
    .where("uuid", uuid)
    .limit(1)
    .catch((err) => {
      console.log(err);
    });

  const userAccountId = result.length > 0 ? result[0].user_account_id : null;

  // Find the user associated with the user_account ID.
  result = await knex("user_accounts")
    .select("user_id")
    .where("id", userAccountId)
    .catch((err) => {
      console.log(err);
    });

  const userId = result.length > 0 ? result[0].user_id : null;

  // Return the first and last name of the user.
  result = await knex("users")
    .select("first_name", "last_name")
    .where("id", userId)
    .catch((err) => {
      console.log(err);
    });

  return result.length > 0 ? result[0] : null;
};

/**
 *
 * Attempts to update a card_entry in the database.
 *
 * @param {number} id The ID of the card_entry to update.
 * @param {string} uuid The new UUID of the card_entry.
 * @param {integer} user_account_id The new user_account_id of the card_entry.
 * @returns {Promise<boolean>} Promise of true if the card_entry was
 * successfully updated, or false if the card_entry could not be updated.
 */
const updateCardEntry = async (id, uuid, user_account_id) => {
  // Simply update the card_entry entry with the given ID.
  return !!(
    await knex("card_entries")
      .where("id", id)
      .update(
        {
          uuid: uuid,
          user_account_id: user_account_id,
        },
        ["id", "uuid", "user_account_id"]
      )
      .catch((err) => {
        console.log(err);
      })
  )[0];
};

/**
 *
 * Attempts to delete a card_entry in the database.
 *
 * @param {number} id The ID of the card_entry to delete.
 * @returns {Promise<boolean>} Promise of true if the card_entry was
 * successfully deleted, or false if the card_entry could not be deleted.
 */
const deleteCardEntry = async (id) => {
  // Simply delete the card_entry entry with the given ID.
  return (
    (await knex("card_entries")
      .where("id", id)
      .del()
      .catch((err) => {
        console.log(err);
      })) > 0
  );
};

module.exports = {
  createCardEntry,
  getCardEntries,
  getUserData,
  updateCardEntry,
  deleteCardEntry,
};
