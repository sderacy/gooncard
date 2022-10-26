const { getUser } = require("../db/users");

module.exports = function (app, path) {
  /**
   * GET /account/login
   *
   * Renders the login page with the given error message.
   */
  app.get("/account/login", (req, res) => {
    // Clear error message and render the page
    const error = req.session.error;
    req.session.error = null;
    res.render(path + "/account/login/index", {
      error,
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
    const user = (await getUser(req.body.email))[0];

    // If the user was found, check the password
    if (user?.password === req.body.password) {
      // Start the user's session and redirect them to the home page
      req.session.user = user;
      res.redirect("/");
    }

    // If the user does not exist, redirect to the login page with message
    else {
      // Redirect to the login page with an error message
      req.session.error = "Login failed.";
      res.redirect("/account/login");
    }
  });
};
