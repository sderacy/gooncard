const { updateName, updateSettings } = require("../db/users");
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
    const success = req.session.success;
    req.session.error = null;
    req.session.success = null;
    res.render(path + "/account/settings/index", {
      user: req.session.user,
      error,
      success,
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
    // Strip out the first and last name from the request body.
    const { first_name, last_name, ...settings } = req.body;

    // If the first or last names are empty, redirect to the settings page with an error.
    if (!first_name || !last_name) {
      req.session.error = "First and last names may not be empty.";
      res.redirect("/account/settings");
      return;
    }

    // Store the settings in the database for the user.
    const email = req.session.user.email;
    const nameResult = await updateName(email, first_name, last_name);
    const settingsResult = await updateSettings(email, settings);

    // If the update was successful, update the user's session and redirect to the settings page.
    if (nameResult && settingsResult) {
      req.session.user = {
        ...req.session.user,
        first_name,
        last_name,
        settings: JSON.stringify(settings),
      };
      req.session.success = "Settings updated successfully!";
      res.redirect("/account/settings");
    }

    // Otherwise, redirect to the settings page with an error message.
    else {
      req.session.error =
        "There was an error updating one or more of your settings.";
      res.redirect("/account/settings");
    }
  });
};
