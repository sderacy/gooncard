// Store references to important elements.
let profile_owner_name = document.getElementById("profile-owner-name");
let profile_contents = document.getElementById("profile-contents");

// Get the UUID from the EJS.
const uuid = document.getElementById("uuid-indicator").innerText;

// Fetch card_entries and user data from database.
fetch("/displaycard/getall", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ uuid: uuid }),
})
  .then((res) => res.json())
  .then((data) => {
    // Push each label / value into arrays.
    const profile_labels = [];
    const profile_values = [];
    data.cardEntries.forEach((entry) => {
      profile_labels.push(entry.label);
      profile_values.push(entry.value);
    });

    // Use the fetched data for the owner's name.
    profile_owner_name.innerText = `${data.userData?.first_name} ${data.userData?.last_name}`;

    for (let i = 0; i < profile_labels.length; i++) {
      // Create a div for each label / value pair.
      let profile_info_div = document.createElement("div");
      profile_info_div.classList.add("bg-white", "rounded-3", "m-3", "p-2");
      profile_info_div.style.wordBreak = "break-all";

      // Use the appropriate faicon (logo) depending on what the platform is
      // Accounts for multiple variations of one platform
      // Hard codes a certain amount of platforms, and for all others, it will display an "information icon"
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

      // Retrieve the account name and insert the value into a span element
      let profile_info_label = document.createElement("span");
      profile_info_label.innerText = profile_labels[i] + ": ";
      profile_info_label.classList.add("profile-info-label");

      // Retrieve the account name and insert the value into a span element
      let profile_info_value = document.createElement("span");
      profile_info_value.innerText = profile_values[i];
      profile_info_value.classList.add("profile-info-value");

      // Append the faicon and the account name to the profile_info_div
      profile_info_div.appendChild(icon_i);
      profile_info_div.appendChild(profile_info_label);
      profile_info_div.appendChild(profile_info_value);

      // Check if the account value is a valid url
      const isValidUrl = (urlString) => {
        let url;
        try {
          url = new URL(urlString);
        } catch (e) {
          return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
      };

      // If it is, then make sure the div is wrapped in an a element
      if (isValidUrl(profile_values[i])) {
        let a_element = document.createElement("a");
        a_element.href = profile_values[i];
        a_element.appendChild(profile_info_div);
        a_element.style.textDecorationColor = "black";
        a_element.target = "_blank";
        profile_contents.appendChild(a_element);
        // If not, then just append the profile_info_div
      } else {
        profile_contents.appendChild(profile_info_div);
      }
    }
  });
