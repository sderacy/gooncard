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
  app.get("/", isLoggedIn, (req, res) => {
    // Pass the user object to the home page
    res.render(path + "/home/home", {
      user: req.session.user,
    });
  });

  /**
   * GET /home/home.css
   *
   * Serves the home page's stylesheet.
   */
  app.get("/home/home.css", (req, res) => {
    res.sendFile(path + "/home/home.css");
  });

  /**
   * GET /home/home.js
   *
   * Serves the home page's script.
   */
  app.get("/home/home.js", (req, res) => {
    res.sendFile(path + "/home/home.js");
  });
};
