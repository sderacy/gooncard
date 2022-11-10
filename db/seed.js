/* Contains the code to delete, recreate, and reseed the database.
 * This script is run by the command `npm run seed` in the main project
 * directory, but additional seeded data can be added in this script
 * when development requires it.
 */

const fs = require("fs");
const { createUser } = require("./users");
const { createUserAccount } = require("./userAccounts");
const { createCardEntry } = require("./cardEntry");
const sqlite3 = require("sqlite3").verbose();

// Delete the old database if it exists
if (fs.existsSync("db/db.sqlite")) {
  console.log("Deleting old database...");
  fs.unlinkSync("db/db.sqlite");
}

// Read in the raw SQL file
const sql = fs.readFileSync("db/schema.sql").toString();

// Create the database
console.log("Creating new database...");
const db = new sqlite3.Database("db/db.sqlite");

// Create the tables
console.log("Creating tables...");
db.exec(sql, function (err) {
  if (err) throw err;
});

// // Seed the database with some data
console.log("Seeding database...");

// User data to seed the database with
const promises = [
  createUser("John", "Doe", "johndoe@email.com", "password"),
  createUser("Jane", "Doe", "janedoe@email.com", "password"),
];

// Wait for both promises to resolve
Promise.all(promises).then(() => {
  // User account data to seed the database with
  const promises = [
    createUserAccount("johndoe@email.com", "instagram", "@johndoe", 0),
    createUserAccount("johndoe@email.com", "twitter", "@johndoe", 0),
    createUserAccount("johndoe@email.com", "email", "johndoe@email.com", 1),
    createUserAccount("janedoe@email.com", "instagram", "@janedoe", 0),
    createUserAccount("janedoe@email.com", "twitter", "@janedoe", 0),
    createUserAccount("janedoe@email.com", "email", "janedoe@email.com", 1),
  ];

  // Wait for all promises to resolve
  Promise.all(promises).then(() => {
    // Card entry data to seed the database with
    const promises = [
      createCardEntry("1234567890", 1),
      createCardEntry("1234567890", 3),
      createCardEntry("0987654321", 5),
      createCardEntry("0987654321", 6),
    ];

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(() => {
        console.log("Done!");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        db.close();
        process.exit(0);
      });
  });
});
