const { createUser, getUser } = require("../db/users");

module.exports = function (app, path) {
  /**
   * GET /account/signup
   *
   * Renders the signup page with the given error message.
   */
  app.get("/account/signup", (req, res) => {
    // Clear error message and user input and render the page
    const error = req.session.error;
    const signupValues = req.session.signupValues;
    req.session.error = null;
    req.session.signupValues = null;
    res.render(path + "/account/signup/index", {
      error,
      signupValues,
    });
  });

  /**
   * GET /account/signup/style
   *
   * Serves the signup page's stylesheet.
   */
  app.get("/account/signup/style", (req, res) => {
    res.sendFile(path + "/account/signup/style.css");
  });

  /**
   * GET /account/signup/main
   *
   * Serves the signup page's script.
   */
  app.get("/account/signup/main", (req, res) => {
    res.sendFile(path + "/account/signup/main.js");
  });

  /**
   * POST /account/signup
   *
   * Creates a new user in the database.
   * Requires a first name, last name, email, and password.
   */
  app.post("/account/signup", async (req, res) => {
    let user = false;

    // FAILURE: Email is already in use
    if (await getUser(req.body.email)) {
      req.session.error = "Email is already in use";
    }

    // FAILURE: Passwords do not match
    else if (req.body.password !== req.body.confirm_password) {
      req.session.error = "Passwords do not match";
    }

    // SUCCESS: Proceed as normal
    else {
      // Try to add the user to the database
      user = await createUser(
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password
      );

      // FAILURE: User could not be added to the database
      if (!user) {
        req.session.error = "Signup failed.";
      }
    }

    // Either start the user's session or redirect to the signup page with error
    if (req.session.error) {
      req.session.signupValues = req.body;
      res.redirect("/account/signup");
    } else {
      req.session.user = user;
      res.redirect("/account/settings");
    }
  });
};
