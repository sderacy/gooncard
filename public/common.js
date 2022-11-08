// Fetches the user's settings from the server, stores it in the
// global scope of the window.
window.globalSettings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();
