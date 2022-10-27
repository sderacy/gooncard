module.exports = function (app, path) {
  // Middleware that redirects to login page if user is not logged in
  const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/account/login");
    }
  };

  /**
   * GET /
   *
   * Renders the home page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/account/profile", isLoggedIn, (req, res) => {
    // Pass the user object to the home page
    res.render(path + "/account/profile/index", {
      user: req.session.user,
    });
  });

  /**
   * GET /home/style
   *
   * Serves the home page's stylesheet.
   */
  app.get("/account/profile/style", (req, res) => {
    res.sendFile(path + "/account/profile/style.css");
  });

  /**
   * GET /home/main
   *
   * Serves the home page's script.
   */
  app.get("/account/profile/main", (req, res) => {
    res.sendFile(path + "/account/profile/main.js");
  });
};
