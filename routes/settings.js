const { getUser, updateSettings } = require("../db/users");
const { isLoggedIn } = require("../util/middleware");

module.exports = function (app, path) {
  /**
   * GET /account/settings
   *
   * Renders the settings page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/account/settings", isLoggedIn, (req, res) => {
    // Pass the user object to the settings page
    const error = req.session.error;
    req.session.error = null;
    res.render(path + "/account/settings/index", {
      user: req.session.user,
      error,
    });
  });

  /**
   * GET /account/settings/style
   *
   * Serves the settings page's stylesheet.
   */
  app.get("/account/settings/style", (req, res) => {
    res.sendFile(path + "/account/settings/style.css");
  });

  /**
   * GET /account/settings/main
   *
   * Serves the settings page's script.
   */
  app.get("/account/settings/main", (req, res) => {
    res.sendFile(path + "/account/settings/main.js");
  });

  /**
   * POST /account/settings/update
   *
   * Updates the user's settings.
   */
  app.post("/account/settings/update", isLoggedIn, async (req, res) => {
    // Store the settings in the database for the user.
    const email = req.session.user.email;

    console.log(req.body);

    const result = await updateSettings(email, req.body);

    // If the update was successful, update the user's session and redirect to the home page.
    if (result) {
      req.session.user = {
        ...req.session.user,
        settings: JSON.stringify(req.body),
      };
      res.redirect("/");
    }

    // Otherwise, redirect to the settings page with an error message.
    else {
      res.redirect("/account/settings");
    }
  });
};
