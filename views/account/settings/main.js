// Determine if the user can save their settings.
const canSubmit = () => {
  // Get the values of the first and last name fields
  var firstName = document.getElementById("editFirstName").value;
  var lastName = document.getElementById("editLastName").value;

  // First and last name must be at least 1 character long
  return firstName.length > 0 && lastName.length > 0;
};

// Should check if the user can log in when the document loads
window.onload = () => {
  if (canSubmit()) {
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("submit").disabled = true;
  }
};

// Add a keyup event listener for the document
document.addEventListener("keyup", function (event) {
  if (canSubmit()) {
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("submit").disabled = true;
  }
});
