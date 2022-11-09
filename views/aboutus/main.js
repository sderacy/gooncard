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
  