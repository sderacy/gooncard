// Elements of interest to be used in the file.
let casual_btn = document.getElementById("casual-btn");
let professional_btn = document.getElementById("professional-btn");
let all_btn = document.getElementById("all-btn");
let none_btn = document.getElementById("none-btn");
let toggles_div = document.getElementById("toggles-div");
let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr-submit");
let size = document.getElementById("size");
let main = document.getElementById("main-content");

// Need to maintain the checked state of the toggle buttons.
let toggles = [];
let toggle_switch_elements = [];

// Store the labels, values, types, and ids into separate arrays.
const labels = [];
const values = [];
const types = [];
const ids = [];

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
    const navBar = document.getElementById("nav");
    const buttons = document.querySelectorAll(".btn");
    if (settings.theme === "Light Theme") {
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
    }
  })
  .catch((error) => {
    console.error(error);
  });

// Fetch the user_accounts from the database.
fetch("/account/profile/getall", { method: "GET" })
  .then((response) => response.json())
  .then((user_accounts) => {
    // If the user has at least one account, display the main content normally.
    if (user_accounts) {
      user_accounts.forEach((account) => {
        labels.push(account.label);
        values.push(account.value);
        types.push(account.type);
        ids.push(account.id);
      });
      main.style.display = "block";
    }

    // If the user does not have any accounts, replace main content with a message.
    else {
      document.getElementById("main-content").innerHTML = `
    <div class="container p-5 mt-5">
      <div class="row p-5 mt-5">
        <div class="col-12">
          <h2 class="text-center">You have no accounts!</h3>
          <h3 class="text-center">Click <a class="text-warning" href="/account/profile">here</a> to add an account.</h3>
        </div>
      </div>
    </div>
  `;
      main.style.display = "block";
    }

    // Populate the page with the toggle switches.
    populatePage();
  });

/**
 * Disables submit button if no toggles are selected.
 */
function check_toggles() {
  qrcode_submit.disabled = toggles.length == 0;
}

/**
 * Populates the page with the toggle switches.
 */
const populatePage = function () {
  for (let i = 0; i < labels.length; i++) {
    // Create the toggle switch and append it to the toggles div.
    let toggle_div = document.createElement("div");
    toggle_div.classList.add("form-check", "form-switch", "form-switch-xl");

    let toggle = document.createElement("input");
    toggle.classList.add("form-check-input", "col-4");
    toggle.type = "checkbox";
    toggle.role = "switch";
    toggle.id = ids[i];
    toggle_switch_elements.push(toggle);

    let toggle_label = document.createElement("label");
    toggle_label.classList.add("form-check-label", "col-4");
    toggle_label.for = ids[i];
    toggle_label.innerText = `${labels[i]}`;

    toggle_div.appendChild(toggle);
    toggle_div.appendChild(toggle_label);
    toggles_div.appendChild(toggle_div);

    /**
     * Keeps track of the activated accounts.
     * Stores the account ID in the 'toggles' array.
     */
    toggle.onchange = function () {
      if (this.checked) {
        toggles.push(parseInt(this.id));
      } else {
        toggles = toggles.filter((id) => id != parseInt(this.id));
      }

      check_toggles();
    };
  }
};

/**
 * Toggles the switches based on the type of account.
 * @param {number} account_type The type of account to toggle.
 */
function toggle_switches(account_type) {
  toggle_switch_elements.forEach((toggle, index) => {
    // Only toggle the account if it is the correct type.
    if (types[index] == account_type) {
      // Need to check/uncheck AND add/remove from toggles array.
      if (!toggle.checked) {
        toggle.checked = true;
        toggles.push(parseInt(toggle.id));
      }
    } else {
      toggle.checked = false
      toggles = toggles.filter((id) => id != parseInt(toggle.id));
    }
  });
}

/**
 * Turns all switches on.
 */
function turn_all_switches_on() {
  toggles = [];
  for (let i = 0; i < toggle_switch_elements.length; i++) {
    toggle_switch_elements[i].checked = true;
    toggles.push(parseInt(toggle_switch_elements[i].id));
  }
}

/**
 * Turns all switches off.
 */
function turn_all_switches_off() {
  for (let i = 0; i < toggle_switch_elements.length; i++) {
    toggle_switch_elements[i].checked = false;
  }
  toggles = [];
}

/**
 * QR Code submission handler.
 * @param {Event} e The event to be handled.
 */
const onGenerateSubmit = async function (e) {
  e.preventDefault();

  // Call the /home/generate endpoint with the toggles array.
  fetch("/home/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: toggles }),
  })
    .then((response) => response.json())
    .then((url) => {
      // Clear the div's contents
      qrcode_div.innerHTML = "";

      // Create the QR code using the google charts api and the uuid.
      let qrcode = document.createElement("img");
      let qrcode_url = new URL("https://chart.googleapis.com/chart?");
      qrcode_url.searchParams.append("chs", size.value);
      qrcode_url.searchParams.append("cht", "qr");
      qrcode_url.searchParams.append("chl", url);
      qrcode_url.searchParams.append("choe", "UTF-8");
      qrcode.src = qrcode_url.toString();
      qrcode.alt = "QR Code";

      // Append the QR Code inside the qrcode div
      qrcode_div.appendChild(qrcode);

      console.log(url);
      alert(url);
    });
};

// Add event listeners for submit and toggle buttons.
qrcode_submit.onclick = onGenerateSubmit;
casual_btn.onclick = function () {
  toggle_switches(0);
  check_toggles();
};
professional_btn.onclick = function () {
  toggle_switches(1);
  check_toggles();
};
all_btn.onclick = function () {
  turn_all_switches_on();
  check_toggles();
};
none_btn.onclick = function () {
  turn_all_switches_off();
  check_toggles();
}
