const session = require("express-session");
const bcrypt = require("bcrypt");
const { getUser } = require("../db/users");
const { getUserAccounts } = require("../db/userAccounts");

module.exports = function (app, path) {
  /**
   * GET /account/login
   *
   * Renders the login page with the given error message.
   */
  app.get("/account/login", (req, res) => {
    // Clear error message and user input and render the page
    const error = req.session.error;
    const loginValues = req.session.loginValues;
    req.session.error = null;
    req.session.loginValues = null;
    res.render(path + "/account/login/index", {
      error,
      loginValues,
    });
  });

  /**
   * GET /account/login/style
   *
   * Serves the login page's stylesheet.
   */
  app.get("/account/login/style", (req, res) => {
    res.sendFile(path + "/account/login/style.css");
  });

  /**
   * GET /account/login/main
   *
   * Serves the login page's script.
   */
  app.get("/account/login/main", (req, res) => {
    res.sendFile(path + "/account/login/main.js");
  });

  /**
   * POST /account/login
   *
   * Logs in a user if the user exists in the database.
   * Requieres a valid email and password.
   */
  app.post("/account/login", async (req, res) => {
    // Get the user from the database
    const user = await getUser(req.body.email);

    // If the user was found, make sure that their password matches (hashed)
    if (user && bcrypt.compareSync(req.body.password, user?.password)) {
      // Get all of the user's user_accounts from the database.
      user.user_accounts = await getUserAccounts(user.email);

      // Start the user's session and redirect them to the home page
      req.session.user = user;
      res.redirect("/");
    }

    // If the user does not exist or passwords do not match, redirect to the login page with message
    else {
      // Redirect to the login page with an error message and previous values.
      req.session.error = "Invalid email or password";
      req.session.loginValues = req.body;
      res.redirect("/account/login");
    }
  });
};
