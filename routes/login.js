const { getUser } = require("../db/users");

module.exports = function (app, path) {
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
    res.render(path + "/account/login/index", {
      error,
    });
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
      res.render(path + "/account/login/index", {
        error,
      });
    }
  });
};
