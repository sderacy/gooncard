module.exports = function (app, path) {
  /**
   * GET /account/logout
   *
   * Logs out the user and redirects to the login page.
   * Uses the GET method so it can be used in an <a>.
   */
  app.get("/account/logout", (req, res, next) => {
    // Destroy the user's session
    req.session.user = null;
    req.session.save(function (err) {
      if (err) next(err);

      // Redirect to the login page
      req.session.regenerate(function (err) {
        if (err) next(err);
        res.redirect("/account/login");
      });
    });
  });
};
