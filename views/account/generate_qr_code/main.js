let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr_submit");
let url = document.getElementById('url');
let size = document.getElementById('size');

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
  qrcode_url.searchParams.append("chl", url.value);
  qrcode_url.searchParams.append("choe", "UTF-8");
  qrcode.src = qrcode_url.toString();
  qrcode.alt = "QR Code";

  // Append the QR Code inside the qrcode div
  qrcode_div.appendChild(qrcode);
};

qrcode_submit.onclick = onGenerateSubmit;
