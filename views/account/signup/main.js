// Store reference to all input fields
var firstNameField = document.getElementById("first_name");
var lastNameField = document.getElementById("last_name");
var emailField = document.getElementById("email");
var passwordField = document.getElementById("password");
var confirmPasswordField = document.getElementById("confirm_password");

// Function that determines if a user can log in or not
const canLogin = () => {
  // Get the values of each input field
  var firstName = firstNameField.value;
  var lastName = lastNameField.value;
  var email = emailField.value;
  var password = passwordField.value;
  var confirmPassword = confirmPasswordField.value;

  // Regex that matches email addresses
  var emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // First and last names must not be blank, email must be valid, password must be long enough, and passwords must match
  return (
    firstName.length > 0 &&
    lastName.length > 0 &&
    emailRegex.test(email) &&
    password.length >= 8 &&
    password === confirmPassword
  );
};

// Should check if the user can log in when the document loads
window.onload = () => {
  if (canLogin()) {
    document.getElementById("register").disabled = false;
  } else {
    document.getElementById("register").disabled = true;
  }
};

// Add a keyup event listener for the document
document.addEventListener("keyup", function (event) {
  if (canLogin()) {
    document.getElementById("register").disabled = false;
  } else {
    document.getElementById("register").disabled = true;
  }
});
