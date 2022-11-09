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

let save_changes = document.getElementById("save-changes");
let cancel_changes = document.getElementById("cancel-changes");

// Set the correct checked radio button for the contrast option.
let highContrast = document.getElementById("highContrast");
let lowContrast = document.getElementById("lowContrast");
if (settings.contrast === "High") {
  highContrast.checked = true;
} else {
  lowContrast.checked = true;
}

// Set the default settings in the DOM.
let originalFirstName = document.getElementById("editFirstName").value;
let originalLastName = document.getElementById("editLastName").value;
document.getElementById("editFontSize").value = settings.font_size;
document.getElementById("editFontFamily").value = settings.font_family;
document.getElementById("editTheme").value = settings.theme;

/**
 * Function to be run whenever any user input is detected. This method ensures
 * that all buttons on the page are either enabled or disabled as appropriate.
 */
const updateFormButtons = () => {
  // Default status of the buttons.
  let submitDisabled = true;
  let cancelDisabled = true;

  // If any of the input fields have changed, enable both buttons.
  if (
    document.getElementById("editFirstName").value !== originalFirstName ||
    document.getElementById("editLastName").value !== originalLastName ||
    document.getElementById("editFontSize").value !== settings.font_size ||
    document.getElementById("editFontFamily").value !== settings.font_family ||
    document.getElementById("editTheme").value !== settings.theme ||
    document.getElementById("highContrast").checked !==
      (settings.contrast === "High")
  ) {
    submitDisabled = false;
    cancelDisabled = false;
  } else {
    // If the input fields have not changed, disable the submit and cancel buttons.
    submitDisabled = true;
    cancelDisabled = true;
  }

  // If any text boxes are empty, disable the submit button.
  var firstName = document.getElementById("editFirstName").value;
  var lastName = document.getElementById("editLastName").value;
  if (firstName === "" || lastName === "") {
    submitDisabled = true;
  }

  // Set the state of the buttons accordingly.
  save_changes.disabled = submitDisabled;
  cancel_changes.disabled = cancelDisabled;
};

// Add event listeners to the input fields.
document.getElementById("editFirstName").oninput = updateFormButtons;
document.getElementById("editLastName").oninput = updateFormButtons;
document.getElementById("editFontSize").onchange = updateFormButtons;
document.getElementById("editFontFamily").onchange = updateFormButtons;
document.getElementById("editTheme").onchange = updateFormButtons;
document.getElementById("highContrast").onchange = updateFormButtons;
document.getElementById("lowContrast").onchange = updateFormButtons;
