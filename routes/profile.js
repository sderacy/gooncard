module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  isLoggedIn = require("../util/middleware").isLoggedIn;

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
};