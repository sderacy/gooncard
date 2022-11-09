// Options available in the settings page.
var options = {
  font_size: ["smaller", "medium", "larger"],
  font_family: ["Times New Roman", "Arial", "Helvetica", "Sans-Serif"],
  theme: ["Light Theme", "Dark Theme"],
};

// Make sure the settings are fetched.
const settings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();

var htmlElement = document.getElementById("html");
htmlElement.setAttribute(
  "style",
  "--bs-body-font-family: " + settings.font_family
);
htmlElement.style.fontSize = settings.font_size;

// Add the options to the select elements.
let selectFontSize = document.getElementById("editFontSize");
options.font_size.forEach((option) => {
  let optionElement = document.createElement("option");
  optionElement.value = option;
  optionElement.innerText = option;
  selectFontSize.appendChild(optionElement);
});

let selectFontFamily = document.getElementById("editFontFamily");
options.font_family.forEach((option) => {
  let optionElement = document.createElement("option");
  optionElement.value = option;
  optionElement.innerText = option;
  selectFontFamily.appendChild(optionElement);
});

let selectTheme = document.getElementById("editTheme");
options.theme.forEach((option) => {
  let optionElement = document.createElement("option");
  optionElement.value = option;
  optionElement.innerText = option;
  selectTheme.appendChild(optionElement);
});

// Set the correct checked radio button for the contrast option.
let highContrast = document.getElementById("highContrast");
let lowContrast = document.getElementById("lowContrast");
if (settings.contrast === "High") {
  highContrast.checked = true;
} else {
  lowContrast.checked = true;
}

// Set the default settings in the DOM.
document.getElementById("editFontSize").value = settings.font_size;
document.getElementById("editFontFamily").value = settings.font_family;
document.getElementById("editTheme").value = settings.theme;

// Determine if the user can save their settings.
const canSubmit = () => {
  // Get the values of the first and last name fields
  var firstName = document.getElementById("editFirstName").value;
  var lastName = document.getElementById("editLastName").value;

  // First and last name must be at least 1 character long
  return firstName.length > 0 && lastName.length > 0;
};

const checkSubmit = () => {
  if (canSubmit()) {
    document.getElementById("save-changes").disabled = false;
  } else {
    document.getElementById("save-changes").disabled = true;
  }
};

// Should check if the user can log in when the document loads
checkSubmit();

// Add a keyup event listener for the document
document.addEventListener("keyup", checkSubmit);
