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
    res.render(path + "/account/profile/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /account/profile/getsettings
   *
   * Returns the user's settings
   *
   */
  app.get("/account/profile/getsettings", isLoggedIn, (req, res) => {
    // Pass the user's email to the profile page
    res.json(JSON.parse(req.session.user.settings));
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
   * POST /account/profile/add
   *
   * Adds a new user_account for the current user.
   */
  app.post("/account/profile/add", isLoggedIn, async (req, res) => {
    const result = await createUserAccount(
      req.session.user.email,
      req.body.label,
      req.body.value,
      req.body.type
    );

    // Respond with either the new user_account object or null.
    res.json(result);
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
   * POST /account/profile/delete
   *
   * Deletes a user_account for the current user.
   */
  app.post("/account/profile/delete", isLoggedIn, async (req, res) => {
    // Only perform the delete if the user_account belongs to the current user.
    let result = null;
    const accountToDelete = await getUserAccount(req.body.id);
    if (accountToDelete && accountToDelete.user_id === req.session.user.id) {
      result = await deleteUserAccount(req.body.id);
    }

    // Respond with either the user_account object or null.
    res.json(result);
  });

  /**
   * POST /account/profile/update
   *
   * Updates all user_accounts for the current user.
   */
  app.post("/account/profile/update", isLoggedIn, async (req, res) => {
    // Only perform the update if the user_account belongs to the current user.
    let result = null;
    const accountToUpdate = await getUserAccount(req.body.id);
    if (accountToUpdate && accountToUpdate.user_id === req.session.user.id) {
      result = await updateUserAccount(
        req.body.id,
        req.body.label,
        req.body.value,
        req.body.type
      );
    }

    // Respond with either the user_account object or null.
    res.json(result);
  });
};
