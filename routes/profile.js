module.exports = function (app, path) {
  const isLoggedIn = require("../util/middleware").isLoggedIn;
  const {
    createUserAccount,
    getUserAccounts,
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
  app.get("/account/profile/getall", isLoggedIn, (req, res) => {});

  /**
   * POST /account/profile/delete
   *
   * Deletes a user_account for the current user.
   */
  app.post("/account/profile/update", isLoggedIn, (req, res) => {});

  /**
   * POST /account/profile/update
   *
   * Updates all user_accounts for the current user.
   */
  app.post("/account/profile/delete", isLoggedIn, (req, res) => {});
};
