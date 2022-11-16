const { getCardEntries, getUserData } = require("../db/cardEntry");

module.exports = function (app, path) {
  /**
   * GET /
   *
   * Renders the displaycard page for the currently logged in user.
   * Uses the isLoggedIn middleware to redirect to confirm this.
   */
  app.get("/displaycard", async (req, res) => {
    // Redirect if query param UUID is not in the database or absent.
    if (!req.query.id || !(await getCardEntries(req.query.id))) {
      res.redirect("/notfound");
      return;
    }

    // Pass the uuid to the displaycard page
    res.render(path + "/displaycard/index", {
      uuid: req.query.id,
    });
  });

  /**
   * GET /displaycard/style
   *
   * Serves the displaycard page's stylesheet.
   */
  app.get("/displaycard/style", (req, res) => {
    res.sendFile(path + "/displaycard/style.css");
  });

  /**
   * GET /displaycard/main
   *
   * Serves the displaycard page's script.
   */
  app.get("/displaycard/main", (req, res) => {
    res.sendFile(path + "/displaycard/main.js");
  });

  /**
   * POST /displaycard/getall
   *
   * Returns all card entries for the given uuid.
   */
  app.post("/displaycard/getall", async (req, res) => {
    const { uuid } = req.body;
    const cardEntries = await getCardEntries(uuid);
    const userData = await getUserData(uuid);
    res.send({ cardEntries, userData });
  });
};
