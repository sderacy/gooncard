// Make sure the settings are fetched.
const settings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();

var htmlElement = document.getElementById("html");
htmlElement.style.fontSize = settings.font_size;
htmlElement.style.fontFamily = settings.font_family;
