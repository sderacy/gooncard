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
  })
  .catch((error) => {
    console.error(error);
  });
