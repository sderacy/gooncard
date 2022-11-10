// Functions for manipulating the card_entry table.
const knex = require("./knex");
const { getUserAccounts } = require("./userAccounts");

/**
 *
 * Attempts to create a new card_entry in the database.
 *
 * @param {string} uuid Id of an instance of a user account
 * @param {integer} user_account_id Id of an instance of a user
 * @returns {Promise<object | null>} Promise of the card_entry object if
 * the card_entry was successfully created, or null if the card_entry
 * could not be created.
 */
const createCardEntry = async (uuid, user_account_id) => {
  // Label and value must be non-empty strings, and type must be 0 or 1
  if (
    label.length < 1 ||
    value.length < 1 ||
    (type !== "0" && type !== "1" && type !== 0 && type !== 1)
  ) {
    return null;
  }

  // Insert the new user account into the database using the user's ID.
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
 * Attempts to find all card_entries for a given user.
 *
 * @param {integer} user_account_id Id of an instance of a user.
 * @returns {Promise<object[] | null>} Promise of the card_entries objects if
 * the card_entries were successfully found, or null if the card_entries
 * could not be found.
 */
const getCardEntries = async (user_account_id) => {
  // Find all card_entries associated with the user's account ID.
  const result = await knex("card_entries")
    .select("*")
    .where("user_account_id", user_account_id)
    .catch((err) => {
      console.log(err);
    });

  return result.length > 0 ? result : null;
};

/**
 *
 * Attempts to find a the user_account id, and id for a given uuid.
 *
 * @param {string} uuid Id of an instance of a user account.
 * @returns {Promise<object | null>} Promise of the card_entries object if
 * the card_entries was successfully found, or null if the card_entries
 * could not be found.
 */
const getCardInfo = async (uuid) => {
  // Find the user_account with the given ID.
  const result = await knex("card_entroes")
    .select("*")
    .where("uuid", uuid)
    .catch((err) => {
      console.log(err);
    });

  return result && result[0] ? result[0] : null;
};

/**
 *
 * Attempts to update a card_entry in the database.
 *
 * @param {number} id The ID of the card_entry to update.
 * @param {string} uuid Id of an instance of a user account
 * @param {integer} user_account_id Id of an instance of a user
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
  getCardInfo,
  updateCardEntry,
  deleteCardEntry,
};
