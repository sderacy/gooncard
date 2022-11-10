let toggles_div = document.getElementById("toggles-div");
let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr_submit");
let size = document.getElementById("size");

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
if (user_accounts) {
  user_accounts.forEach((account) => {
    labels.push(account.label);
    values.push(account.value);
    types.push(account.type);
    ids.push(account.id);
  });
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
      toggles.push(parseInt(this.id));
    } else {
      toggles = toggles.filter((id) => id != parseInt(this.id));
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

  // Call the /home/generate endpoint with the toggles array.
  const uuid = await (
    await fetch("/home/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: toggles }),
    })
  ).json();

  // Get the address of the server.
  const siteAddress = await (
    await fetch("/home/siteaddress", {
      method: "GET",
    })
  ).json();

  // Clear the div's contents
  qrcode_div.innerHTML = "";

  // Create the QR code using the google charts api and the uuid.
  const url = `http://${siteAddress}/displaycard?id=${uuid}`;
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
};

qrcode_submit.onclick = onGenerateSubmit;
