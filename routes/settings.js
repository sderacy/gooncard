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
    res.render(path + "/account/settings/index", {
      user: req.session.user,
      error: null,
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
    const result = await updateSettings(email, req.body);

    // If the update was successful, update the user's session and render the home page.
    if (result) {
      req.session.user = {
        ...req.session.user,
        settings: req.body,
      };
      res.render(path + "/home/index", {
        user: req.session.user,
      });
    }

    // Otherwise, render the settings page with an error message.
    else {
      res.render(path + "/account/settings/index", {
        user: req.session.user,
        error: "There was an error updating the settings.",
      });
    }
  });
};
