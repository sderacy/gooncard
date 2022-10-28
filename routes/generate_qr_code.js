module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  isLoggedIn = require("../util/middleware").isLoggedIn;

  /**
   * GET /account/generate_qr_code
   *
   * Renders the qr code page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/account/generate_qr_code", isLoggedIn, (req, res) => {
    // Pass the user object to the profile page
    res.render(path + "/account/generate_qr_code/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /account/generate_qr_code/style
   *
   * Serves the qr code page's stylesheet.
   */
  app.get("/account/generate_qr_code/style", (req, res) => {
    res.sendFile(path + "/account/generate_qr_code/style.css");
  });

  /**
   * GET /account/generate_qr_code/main
   *
   * Serves the profile page's script.
   */
  app.get("/account/generate_qr_code/main", (req, res) => {
    res.sendFile(path + "/account/generate_qr_code/main.js");
  });
};
