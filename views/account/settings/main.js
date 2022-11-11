// Options available in the settings page.
var options = {
  font_size: ["smaller", "medium", "larger"],
  font_family: ["Times New Roman", "Arial", "Helvetica", "Sans-Serif"],
  theme: ["Light Theme", "Dark Theme"],
};

const prettyFontSize = {
  smaller: "Small",
  medium: "Medium",
  larger: "Large",
};

// Make sure the settings are fetched.
fetch("/account/profile/getsettings", { method: "GET" })
  .then((response) => response.json())
  .then((settings) => {
    // Update the display with these settings.
    displayChanges(
      settings.font_size,
      settings.font_family,
      settings.theme,
      settings.contrast
    );

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

    /**
     * Special callback for any settings that modify the current page's appearance.
     */
    const updateButtonsAndDisplay = () => {
      updateFormButtons();
      displayChanges(
        document.getElementById("editFontSize").value,
        document.getElementById("editFontFamily").value,
        document.getElementById("editTheme").value,
        document.getElementById("highContrast").checked ? "High" : "Low"
      );
    };

    // Add event listeners to the input fields.
    document.getElementById("editFirstName").oninput = updateFormButtons;
    document.getElementById("editLastName").oninput = updateFormButtons;
    document.getElementById("editFontSize").onchange = updateButtonsAndDisplay;
    document.getElementById("editFontFamily").onchange =
      updateButtonsAndDisplay;
    document.getElementById("editTheme").onchange = updateButtonsAndDisplay;
    document.getElementById("highContrast").onchange = updateButtonsAndDisplay;
    document.getElementById("lowContrast").onchange = updateButtonsAndDisplay;
  })
  .catch((error) => {
    console.error(error);
  });

// Add the options to the select elements.
let selectFontSize = document.getElementById("editFontSize");
options.font_size.forEach((option) => {
  let optionElement = document.createElement("option");
  optionElement.value = option;
  optionElement.innerText = prettyFontSize[option];
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
 * When the user modifies a setting that changes the appearance of the page,
 * should apply those settings temporarily to the page to show the user.
 */
const displayChanges = (fontSize, fontFamily, theme, contrast) => {
  var htmlElement = document.getElementById("html");
  htmlElement.setAttribute("style", "--bs-body-font-family: " + fontFamily);
  htmlElement.style.fontSize = fontSize;

  const div = document.getElementById("body"); // Get element from DOM
  const navBar = document.getElementById("nav");
  const buttons = document.querySelectorAll(".btn");
  const contrastDivs = document.querySelectorAll(".contrast");
  const navLinks = document.querySelectorAll(".nav-link");
  if (theme === "Light Theme") {
    div.classList.remove("dark-mode");
    div.classList.remove("bg-dark");
    div.classList.remove("text-white");
    div.classList.add("light-mode");
    div.classList.add("text-navy");

    navBar.classList.remove("navbar-dark");

    buttons.forEach((button) => {
      if (button.classList.contains("btn-warning")) {
        button.classList.remove("btn-warning");
        button.classList.add("btn-dark");
        button.classList.add("bg-navy");
      }
    });

    contrastDivs.forEach((contrastDiv) => {
      if (contrast == "High") {
        contrastDiv.classList.add("high-contrast-light");
        navLinks.forEach((navLink) => {
          navLink.classList.add("high-contrast-light");
        });
      } else {
        contrastDiv.classList.remove("high-contrast-light");
        navLinks.forEach((navLink) => {
          navLink.classList.remove("high-contrast-light");
        });
      }
    });
  } else {
    div.classList.add("dark-mode");
    div.classList.add("bg-dark");
    div.classList.add("text-white");
    div.classList.remove("light-mode");
    div.classList.remove("text-navy");

    navBar.classList.add("navbar-dark");

    buttons.forEach((button) => {
      if (button.classList.contains("btn-dark")) {
        button.classList.remove("btn-dark");
        button.classList.remove("bg-navy");
        button.classList.add("btn-warning");
      }
    });

    contrastDivs.forEach((contrastDiv) => {
      if (contrast == "High") {
        contrastDiv.classList.add("high-contrast-dark");
        navLinks.forEach((navLink) => {
          navLink.classList.add("high-contrast-dark");
        });
      } else {
        contrastDiv.classList.remove("high-contrast-dark");
        navLinks.forEach((navLink) => {
          navLink.classList.remove("high-contrast-dark");
        });
      }
    });
  }
};

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
