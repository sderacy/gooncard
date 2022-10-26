const fs = require("fs");
const { createUser } = require("./users");
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

// Seed the database with some data
console.log("Seeding database...");

// Data to seed the database with
const promises = [
  createUser("John", "Doe", "johndoe@email.com", "password"),
  createUser("Jane", "Doe", "janedoe@email.com", "password"),
];

// Wait for both promises to resolve
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
