let profile_owner_name = document.getElementById("profile-owner-name");
let profile_contents = document.getElementById("profile-contents");

// Values to be connected with the DB
profile_owner_name.innerText = "Leah Kazenmayer";
let profile_labels = [
  "email",
  "phone number",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "github",
  "personal website",
];
let profile_values = [
  "kazenml1@tcnj.edu",
  "(123) 456 - 7890",
  "lelekaz",
  "kazy2001",
  "leletweet",
  "https://www.linkedin.com/in/leah-kazenmayer/",
  "https://github.com/lelekaz",
  "lelekaz.com",
];

for (let i = 0; i < profile_labels.length; i++) {
  let profile_info_div = document.createElement("div");
  profile_info_div.classList.add("profile-info-div");

  let icon_i = document.createElement("i");
  switch (profile_labels[i].toLowerCase()) {
    case "cell phone number":
    case "cell phone":
    case "phone number":
    case "phone":
    case "cell":
      icon_i.classList.add("fa-solid", "fa-phone");
      break;
    case "email":
      icon_i.classList.add("fa-solid", "fa-envelope");
      break;
    case "instagram":
    case "insta":
    case "gram":
      icon_i.classList.add("fa-brands", "fa-instagram");
      break;
    case "facebook":
      icon_i.classList.add("fa-brands", "fa-facebook-f");
      break;
    case "twitter":
      icon_i.classList.add("fa-brands", "fa-twitter");
      break;
    case "linkedin":
      icon_i.classList.add("fa-brands", "fa-linkedin");
      break;
    case "github":
      icon_i.classList.add("fa-brands", "fa-github");
    default:
      icon_i.classList.add("fa-solid", "fa-circle-info");
  }

  let profile_info_value = document.createElement("span");
  profile_info_value.innerText = profile_values[i];
  profile_info_value.classList.add("profile-info-value");

  profile_info_div.appendChild(icon_i);
  profile_info_div.appendChild(profile_info_value);

  profile_contents.appendChild(profile_info_div);
}
