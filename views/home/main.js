let toggles_div = document.getElementById("toggles-div");
let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr_submit");
let size = document.getElementById("size");

// These social medias will be pulled from the DB
let social_medias = ["Instagram", "Facebook", "LinkedIn", "Email", "Number"];
// URL will be changed to the page that displays all of the info of the user
let url = "http://www.google.com";

for (let i = 0; i < social_medias.length; i++) {
  let toggle_div = document.createElement("div");
  toggle_div.classList.add("form-check", "form-switch", "form-switch-xl");
  let toggle = document.createElement("input");
  toggle.classList.add("form-check-input", "col-4");
  toggle.type = "checkbox";
  toggle.role = "switch";
  toggle.id = social_medias[i];
  let toggle_label = document.createElement("label");
  toggle_label.classList.add("form-check-label", "col-4");
  toggle_label.for = social_medias[i];
  toggle_label.innerText = social_medias[i];

  toggle_div.appendChild(toggle);
  toggle_div.appendChild(toggle_label);

  toggles_div.appendChild(toggle_div);
}

// Button submit
let onGenerateSubmit = async function (e) {
  e.preventDefault();

  // Clear the div's contents
  qrcode_div.innerHTML = "";

  // Create the QR code using the google charts api
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
