const { createUser } = require("../db/users");

module.exports = function (app, path) {
  /**
   * GET /account/signup
   *
   * Renders the signup page with the given error message.
   */
  app.get("/account/signup", (req, res) => {
    // Clear error message and render the page
    const error = req.session.error;
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
      // Redirect to the signup page with an error message
      req.session.error = "Signup failed.";
      res.redirect("/account/signup");
    }
  });
};
