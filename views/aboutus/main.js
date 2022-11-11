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
    const contentDiv = document.getElementById("content-div");
    const navBar = document.getElementById("nav");
    const buttons = document.querySelectorAll(".btn");
    if (settings.theme === "Light Theme") {
      div.classList.remove("dark-mode");
      div.classList.remove("bg-dark");
      div.classList.remove("text-white");
      div.classList.add("light-mode");
      div.classList.add("text-navy");

      contentDiv.classList.remove("text-white");
      contentDiv.classList.add("text-navy");

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

      contentDiv.classList.remove("text-navy");
      contentDiv.classList.add("text-white");

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
