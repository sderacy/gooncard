module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  isLoggedIn = require("../util/middleware").isLoggedIn;

  /**
   * GET /account/settings
   *
   * Renders the settings page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/account/settings", isLoggedIn, (req, res) => {
    // Pass the user object to the settings page
    res.render(path + "/account/settings/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /account/settings/style
   *
   * Serves the settings page's stylesheet.
   */
  app.get("/account/settings/style", (req, res) => {
    res.sendFile(path + "/account/settings/style.css");
  });

  app.get("/partials/common", (req, res) => {
    res.sendFile(path + "/partials/common.css");
  });

  /**
   * GET /account/settings/main
   *
   * Serves the settings page's script.
   */
  app.get("/account/settings/main", (req, res) => {
    res.sendFile(path + "/account/settings/main.js");
  });
};
