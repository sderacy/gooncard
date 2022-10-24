const { createUser, getUser } = require("../db/users");

module.exports = function (app, path) {
  /**
   * GET /account/signup
   *
   * Renders the signup page with the given error message.
   */
  app.get("/account/signup", (req, res) => {
    // Set error message if signup failed
    const error = req.session.error ? "Login failed." : null;

    // Clears session data so that failure message does not persist
    req.session.error = null;
    res.render(path + "/account/signup", {
      error,
    });
  });

  /**
   * GET /account/login
   *
   * Renders the login page with the given error message.
   */
  app.get("/account/login", (req, res) => {
    // Set error message if login failed
    const error = req.session.error ? "Login failed." : null;

    // Clears session data so that failure message does not persist
    req.session.error = null;
    res.render(path + "/account/login", {
      error,
    });
  });

  /**
   * POST /account/signup
   *
   * Creates a new user in the database.
   * Requires a first name, last name, email, and password.
   */
  app.post("/account/signup", async (req, res) => {
    // Add the user to the database
    const user = (
      await createUser(
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password
      )
    )[0];

    if (user) {
      // Start the user's session and redirect them to the home page
      req.session.user = user;
      res.redirect("/");
    } else {
      // Set error message
      const error = "Signup failed.";

      // Clears session data so that failure message does not persist
      req.session.error = null;

      // Render the signup page with an error message
      res.render(path + "/account/signup", {
        error,
      });
    }
  });

  /**
   * POST /account/login
   *
   * Logs in a user if the user exists in the database.
   * Requieres a valid email and password.
   */
  app.post("/account/login", async (req, res) => {
    // Get the user from the database
    const user = (await getUser(req.body.email))[0];

    // If the user was found, check the password
    if (user?.password === req.body.password) {
      // Start the user's session and redirect them to the home page
      req.session.user = user;
      res.redirect("/");
    }

    // If the user does not exist, redirect to the login page with message
    else {
      // Set error message
      const error = "Login failed.";

      // Clears session data so that failure message does not persist
      req.session.error = null;

      // Render the signup page with an error message
      res.render(path + "/account/login", {
        error,
      });
    }
  });

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
