module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  isLoggedIn = require("../util/middleware").isLoggedIn;

  /**
   * GET /
   *
   * Renders the aboutus page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/aboutus", isLoggedIn, (req, res) => {
    // Pass the user object to the aboutus page
    res.render(path + "/aboutus/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /aboutus/style
   *
   * Serves the aboutus page's stylesheet.
   */
  app.get("/aboutus/style", (req, res) => {
    res.sendFile(path + "/aboutus/style.css");
  });

  app.get("/partials/common", (req, res) => {
    res.sendFile(path + "/partials/common.css");
  });

  /**
   * GET /aboutus/main
   *
   * Serves the aboutus page's script.
   */
  app.get("/aboutus/main", (req, res) => {
    res.sendFile(path + "/aboutus/main.js");
  });
};
