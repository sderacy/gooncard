module.exports = function (app, path, address, port) {
  // Middleware that redirects to login page if user is not logged in
  const isLoggedIn = require("../util/middleware").isLoggedIn;
  const { getUserAccounts } = require("../db/userAccounts");
  const { createCardEntry, getCardEntries } = require("../db/cardEntry");
  const { v4: uuidv4 } = require("uuid");

  /**
   * GET /
   *
   * Renders the home page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/", isLoggedIn, (req, res) => {
    // Pass the user object to the home page
    res.render(path + "/home/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /home/style
   *
   * Serves the home page's stylesheet.
   */
  app.get("/home/style", (req, res) => {
    res.sendFile(path + "/home/style.css");
  });

  /**
   * GET /home/main
   *
   * Serves the home page's script.
   */
  app.get("/home/main", (req, res) => {
    res.sendFile(path + "/home/main.js");
  });

  /**
   * POST /home/generate
   *
   * Generates a UUID for the user's new Goon Card.
   * Returns the UUID if successful, or null if unsuccessful.
   */
  app.post("/home/generate", isLoggedIn, async (req, res) => {
    // Retrieve all of the user's user_account ids from the database.
    const ids = (await getUserAccounts(req.session.user.email)).map(
      (account) => account.id
    );

    // If the user has no user_accounts or no submitted ids, return an error.
    const submittedIds = req.body.ids;
    if (ids.length === 0 || submittedIds.length === 0) {
      res.json(null);
      return;
    }

    // Make sure that each id in the body is an account id for the user.
    const valid = submittedIds.every((id) => ids.includes(id));
    if (!valid) {
      res.json(null);
      return;
    }

    // Generate a UUID and make sure it does not already exist in the database.
    let generated = false;
    let uuid = null;
    while (!generated) {
      // Generate a UUID.
      uuid = uuidv4();

      // Check if the UUID already exists in the database.
      const exists = (await getCardEntries(uuid)) !== null;

      // If the UUID does not exist in the database, use it
      if (!exists) {
        generated = true;
      }
    }

    // Use the UUID to create new card_entries in the database.
    const promises = [];
    submittedIds.forEach((id) => {
      promises.push(createCardEntry(uuid, id));
    });

    // Wait for all of the card_entries to be created.
    Promise.all(promises)
      .then((results) => {
        // Successfully created all card_entries.
        res.json(`http://${address}:${port}/displaycard?id=${uuid}`);
      })
      .catch((err) => {
        // Failed to create all card_entries.
        console.log(err);
        res.json(null);
      });
  });
};
