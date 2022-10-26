// Store reference to username and password fields
var emailField = document.getElementById("email");
var passwordField = document.getElementById("password");

// Function that determines if a user can log in or not
const canLogin = () => {
  // Get the values of the username and password fields
  var email = emailField.value;
  var password = passwordField.value;

  // Regex that matches email addresses
  var emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Password must be long enough and email must be valid
  return emailRegex.test(email) && password.length >= 8;
};

// Should check if the user can log in when the document loads
window.onload = () => {
  if (canLogin()) {
    document.getElementById("login").disabled = false;
  } else {
    document.getElementById("login").disabled = true;
  }
};

// Add a keyup event listener for the document
document.addEventListener("keyup", function (event) {
  if (canLogin()) {
    document.getElementById("login").disabled = false;
  } else {
    document.getElementById("login").disabled = true;
  }
});
