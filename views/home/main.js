let toggles_div = document.getElementById("toggles-div");
let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr_submit");
let size = document.getElementById("size");
let main = document.getElementById("main-content");

// Fetch the user_accounts from the database.
let user_accounts = await (
  await fetch("/account/profile/getall", { method: "GET" })
).json();

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

// Store the labels, values, types, and ids into separate arrays.
let labels = [];
let values = [];
let types = [];
let ids = [];

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

// Need to maintain the checked state of the toggle buttons.
let toggles = [];

for (let i = 0; i < labels.length; i++) {
  let toggle_div = document.createElement("div");
  toggle_div.classList.add("form-check", "form-switch", "form-switch-xl");

  let toggle = document.createElement("input");
  toggle.classList.add("form-check-input", "col-4");
  toggle.type = "checkbox";
  toggle.role = "switch";
  toggle.id = ids[i];

  /**
   * Keeps track of the activated accounts.
   * Stores the account ID in the 'toggles' array.
   */
  toggle.onchange = function () {
    if (this.checked) {
      toggles.push(this.id);
    } else {
      toggles = toggles.filter((id) => id != this.id);
    }
    console.log(toggles);
  };

  let toggle_label = document.createElement("label");
  toggle_label.classList.add("form-check-label", "col-4");
  toggle_label.for = ids[i];
  toggle_label.innerText = `${labels[i]}: ${values[i]}`;

  toggle_div.appendChild(toggle);
  toggle_div.appendChild(toggle_label);
  toggles_div.appendChild(toggle_div);
}

/**
 * QR Code submission handler.
 * @param {Event} e The event to be handled.
 */
let onGenerateSubmit = async function (e) {
  e.preventDefault();

  // CALL THE GENERATE QR CODE API ENDPOINT WITH TOGGLES ARRAY
  // DISPLAY THE RESPONDED QR CODE IMAGE

  // Clear the div's contents
  qrcode_div.innerHTML = "";

  // Create the QR code using the google charts api
  let url = "You toggled the following accounts: " + toggles.join(", ");
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
};

qrcode_submit.onclick = onGenerateSubmit;
