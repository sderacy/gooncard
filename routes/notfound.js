module.exports = function (app, path) {
  /**
   * GET /
   *
   * Renders the not found page.
   */
  app.get("/notfound", (req, res) => {
    // Pass the user object to the notfound page
    res.render(path + "/notfound/index");
  });

  /**
   * GET /notfound/style
   *
   * Serves the notfound page's stylesheet.
   */
  app.get("/notfound/style", (req, res) => {
    res.sendFile(path + "/notfound/style.css");
  });

  /**
   * GET /notfound/main
   *
   * Serves the notfound page's script.
   */
  app.get("/notfound/main", (req, res) => {
    res.sendFile(path + "/notfound/main.js");
  });
};
