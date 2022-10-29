module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  isLoggedIn = require("../util/middleware").isLoggedIn;

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

  app.get("/partials/common", (req, res) => {
    res.sendFile(path + "/partials/common.css");
  });

  /**
   * GET /home/main
   *
   * Serves the home page's script.
   */
  app.get("/home/main", (req, res) => {
    res.sendFile(path + "/home/main.js");
  });
};
