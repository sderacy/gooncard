// Options available in the settings page.
var options = {
  font_size: ["smaller", "medium", "larger"],
  font_family: ["Times New Roman", "Arial", "Helvetica", "Sans-Serif"],
  theme: ["Light Theme", "Dark Theme"],
};

// Make sure the settings are fetched.
fetch("/account/profile/getsettings", { method: "GET" })
  .then((response) => response.json())
  .then((settings) => {
    var htmlElement = document.getElementById("html");
    htmlElement.setAttribute(
      "style",
      "--bs-body-font-family: " + settings.font_family
    );
    htmlElement.style.fontSize = settings.font_size;

    const div = document.getElementById("body"); // Get element from DOM
    const buttons = document.querySelectorAll("btn");
    if (settings.theme === "Light Theme") {
      div.classList.remove("dark-mode");
      div.classList.remove("bg-dark");
      div.classList.remove("text-white");
      div.classList.remove("navbar-dark");
      div.classList.add("light-mode");
      div.classList.add("text-primary");

      buttons.forEach((button) => {
        if (button.classList.contains("btn-warning")) {
          button.classList.remove("btn-warning");
          button.classList.add("btn-dark");
        }
      });
    } else {
      div.classList.add("dark-mode");
      div.classList.add("bg-dark");
      div.classList.add("text-white");
      div.classList.add("navbar-dark");
      div.classList.remove("light-mode");
      div.classList.remove("text-primary");

      buttons.forEach((button) => {
        if (button.classList.contains("btn-dark")) {
          button.classList.remove("btn-dark");
          button.classList.add("btn-warning");
        }
      });
    }

    // Set and store the default settings in the DOM.
    document.getElementById("editFontSize").value = settings.font_size;
    document.getElementById("editFontFamily").value = settings.font_family;
    document.getElementById("editTheme").value = settings.theme;
    if (settings.contrast === "High") {
      highContrast.checked = true;
    } else {
      lowContrast.checked = true;
    }

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
        document.getElementById("editFontFamily").value !==
          settings.font_family ||
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
  })
  .catch((error) => {
    console.error(error);
  });

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

// Store references to useful input fields.
let originalFirstName = document.getElementById("editFirstName").value;
let originalLastName = document.getElementById("editLastName").value;

let save_changes = document.getElementById("save-changes");
let cancel_changes = document.getElementById("cancel-changes");
let highContrast = document.getElementById("highContrast");
let lowContrast = document.getElementById("lowContrast");

/**
 * When the user clicks on the cancel button, the page is reloaded after confirmation
 * in order to reset the user's account changes since the last save.
 */
cancel_changes.onclick = () => {
  if (
    confirm(
      "Are you sure you want to cancel? All changes since your last save will be lost."
    )
  ) {
    location.reload();
  }
};
