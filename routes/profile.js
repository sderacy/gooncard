module.exports = function (app, path) {
  const isLoggedIn = require("../util/middleware").isLoggedIn;
  const {
    createUserAccount,
    getUserAccounts,
    getUserAccount,
    updateUserAccount,
    deleteUserAccount,
  } = require("../db/userAccounts");

  /**
   * GET /account/profile
   *
   * Renders the profile page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/account/profile", isLoggedIn, (req, res) => {
    // Pass the user object to the profile page
    const error = req.session.error;
    const success = req.session.success;
    req.session.error = null;
    req.session.success = null;
    res.render(path + "/account/profile/index", {
      user: req.session.user,
      success,
      error,
    });
  });

  /**
   * GET /account/profile/getsettings
   *
   * Returns the user's settings
   *
   */
  app.get("/account/profile/getsettings", (req, res) => {
    // Never want to redirect, so perform login check here.
    if (!req.session.user) {
      res.json({ error: "Not logged in." });
    } else {
      // Pass the user's email to the profile page
      res.json(JSON.parse(req.session.user.settings));
    }
  });

  /**
   * GET /account/profile/style
   *
   * Serves the profile page's stylesheet.
   */
  app.get("/account/profile/style", (req, res) => {
    res.sendFile(path + "/account/profile/style.css");
  });

  /**
   * GET /account/profile/main
   *
   * Serves the profile page's script.
   */
  app.get("/account/profile/main", (req, res) => {
    res.sendFile(path + "/account/profile/main.js");
  });

  /**
   * GET /account/profile/getall
   *
   * Gets all user_accounts for the current user.
   */
  app.get("/account/profile/getall", isLoggedIn, async (req, res) => {
    const result = await getUserAccounts(req.session.user.email);

    // Respond with either the user_accounts array or null.
    res.json(result);
  });

  /**
   * POST /account/profile/update
   *
   * Updates all user_accounts for the current user.
   */
  app.post("/account/profile/update", isLoggedIn, async (req, res) => {
    // Array to store all promises.
    const promises = [];

    // Extract the individual arrays from the responts.
    const { add, edit, remove } = req.body;

    // For each user_account to add, store it in the database.
    add.forEach((account) => {
      promises.push(
        createUserAccount(
          req.session.user.email,
          account.label,
          account.value,
          account.type
        )
      );
    });

    // For each user_account to edit, update it in the database.
    edit.forEach(async (account) => {
      // Only perform the update if the user_account belongs to the current user.
      const accountToUpdate = await getUserAccount(account.id);
      if (accountToUpdate && accountToUpdate.user_id === req.session.user.id) {
        promises.push(
          updateUserAccount(
            account.id,
            account.label,
            account.value,
            account.type
          )
        );
      }
    });

    // For each user_account to remove, delete it from the database.
    remove.forEach(async (id) => {
      // Only perform the update if the user_account belongs to the current user.
      const accountToUpdate = await getUserAccount(id);
      if (accountToUpdate && accountToUpdate.user_id === req.session.user.id) {
        promises.push(deleteUserAccount(id));
      }
    });

    // Wait for all promises to resolve.
    try {
      await Promise.all(promises);
      req.session.success = "Successfully updated your user accounts!";
    } catch (err) {
      req.session.error =
        "There was an error updating one or more or your accounts. Please try again.";
    }

    // Respond with a success message.
    res.json({ success: true });
  });
};
