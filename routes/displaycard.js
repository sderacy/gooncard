module.exports = function (app, path) {
  /**
   * GET /
   *
   * Renders the displaycard page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/displaycard", (req, res) => {
    // Pass the user object to the displaycard page
    res.render(path + "/displaycard/index");
  });

  /**
   * GET /displaycard/style
   *
   * Serves the displaycard page's stylesheet.
   */
  app.get("/displaycard/style", (req, res) => {
    res.sendFile(path + "/displaycard/style.css");
  });

  /**
   * GET /displaycard/main
   *
   * Serves the displaycard page's script.
   */
  app.get("/displaycard/main", (req, res) => {
    res.sendFile(path + "/displaycard/main.js");
  });
};
