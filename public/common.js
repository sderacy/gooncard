const settings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();

