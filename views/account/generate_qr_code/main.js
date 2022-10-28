let form = document.getElementById("generate-form");
let qr = document.getElementById("qrcode");
let qr_submit = document.getElementById("qr_submit");

// Button submit
let onGenerateSubmit = (e) => {
  e.preventDefault();

  qr.innerHTML = "";

  const url = document.getElementById("url").value;
  const size = document.getElementById("size").value;

  // Validate url
  if (url === "") {
    alert("Please enter a URL");
  } else {
    generateQRCode(url, size);
  }
};

// Generate QR code
let generateQRCode = (url, size) => {
  let qrcode = new QRCode("qrcode", {
    text: url,
    width: size,
    height: size,
  });
};

qr_submit.onclick = onGenerateSubmit;
