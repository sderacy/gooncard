const express = require("express");
const session = require("express-session");
const address = require("address");
const bodyParser = require("body-parser");

// Create backend constants
const app = express();
const siteAddress = process.argv.includes("--vm")
  ? "gooncard.hpc.tcnj.edu"
  : address.ip();
const port = 3000;
const viewsPath = __dirname + "/views";
const sessionKey = "secret";

// Use ejs as the view engine
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Allow parsing of body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Provide the directory for static image files
app.use(express.static(__dirname + "/public"));

// Using sessions to determine if user is logged in
app.use(
  session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: true,
    error: null,
    success: null,
    loginValues: null,
    signupValues: null,
  })
);

// Import all routes from their respective files
require("./routes/home")(app, viewsPath, siteAddress, port);
require("./routes/login")(app, viewsPath);
require("./routes/logout")(app, viewsPath);
require("./routes/signup")(app, viewsPath);
require("./routes/profile")(app, viewsPath);
require("./routes/settings")(app, viewsPath);
require("./routes/aboutus")(app, viewsPath);
require("./routes/displaycard")(app, viewsPath);
require("./routes/notfound")(app, viewsPath);

// Redirect any other unknown requests to the home page
app.get("*", (req, res) => {
  res.redirect("/");
});

// Start the server
app.listen(port, () =>
  console.log(`Access the server at http://${siteAddress}:${port}`)
);
