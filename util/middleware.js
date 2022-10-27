// Middleware that redirects to login page if user is not logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/account/login");
  }
};

module.exports = { isLoggedIn };
