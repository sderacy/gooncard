const { createUser } = require("../db/users");

module.exports = function (app, path) {
  /**
   * GET /account/signup
   *
   * Renders the signup page with the given error message.
   */
  app.get("/account/signup", (req, res) => {
    // Set error message if signup failed
    const error = req.session.error ? "Signup failed." : null;

    // Clears session data so that failure message does not persist
    req.session.error = null;
    res.render(path + "/account/signup/index", {
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
      res.render(path + "/account/signup/index", {
        error,
      });
    }
  });
};
