// Elements of interest to be used in the file.
let casual_btn = document.getElementById("casual-btn");
let professional_btn = document.getElementById("professional-btn");
let all_btn = document.getElementById("all-btn");
let none_btn = document.getElementById("none-btn");
let toggles_div = document.getElementById("toggles-div");
let qrcode_div = document.getElementById("qrcode-div");
let qrcode_submit = document.getElementById("qr-submit");
let size = document.getElementById("size");
let main = document.getElementById("main-content");
let contrast_indicator = document.getElementById("contrast-indicator");
let mic_icon = document.getElementById("mic-icon");

// Need to maintain the checked state of the toggle buttons.
let toggles = [];
let toggle_switch_elements = [];

// Get the contrast type based on the page's contrast div.
const contrastType = contrast_indicator.classList.contains("high-contrast-dark")
  ? "high-contrast-dark"
  : contrast_indicator.classList.contains("high-contrast-light")
    ? "high-contrast-light"
    : null;

// Store the labels, values, types, and ids into separate arrays.
const labels = [];
const values = [];
const types = [];
const ids = [];

let isTalking = false;

// Fetch the user_accounts from the database.
fetch("/account/profile/getall", { method: "GET" })
  .then((response) => response.json())
  .then((user_accounts) => {
    // If the user has at least one account, display the main content normally.
    if (user_accounts) {
      user_accounts.forEach((account) => {
        labels.push(account.label);
        values.push(account.value);
        types.push(account.type);
        ids.push(account.id);
      });
      main.style.display = "block";
    }

    // If the user does not have any accounts, replace main content with a message.
    else {
      document.getElementById("main-content").innerHTML = `
    <div class="container p-5 mt-5">
      <div class="row p-5 mt-5">
        <div class="col-12">
          <h2 class="text-center ${contrastType}">You have no accounts!</h3>
          <h3 class="text-center ${contrastType}">Click <a class="text-warning ${contrastType}" href="/account/profile">here</a> to add an account.</h3>
        </div>
      </div>
    </div>
  `;
      main.style.display = "block";
    }

    // Populate the page with the toggle switches.
    populatePage();
  });

/**
 * Disables submit button if no toggles are selected.
 */
function check_toggles() {
  qrcode_submit.disabled = toggles.length == 0;
}

/**
 * Populates the page with the toggle switches.
 */
const populatePage = function () {
  for (let i = 0; i < labels.length; i++) {
    // Create the toggle switch and append it to the toggles div.
    let toggle_div = document.createElement("div");
    toggle_div.classList.add(
      "form-switch",
      "form-check",
      "form-switch-xl",
      "col-lg-9",
      "col-10"
    );

    let toggle = document.createElement("input");
    toggle.classList.add("form-check-input");
    toggle.type = "checkbox";
    toggle.role = "switch";
    toggle.id = ids[i];
    toggle_switch_elements.push(toggle);

    let toggle_label_span = document.createElement("span");
    toggle_label_span.classList.add(contrastType, "lh-3");
    toggle_label_span.classList.add("form-check-label");
    toggle_label_span.for = ids[i];
    toggle_label_span.innerText = `${labels[i].charAt(0).toUpperCase()}${labels[
      i
    ].slice(1)}`;

    toggle_div.appendChild(toggle_label_span);
    toggle_div.appendChild(toggle);
    toggles_div.appendChild(toggle_div);

    /**
     * Keeps track of the activated accounts.
     * Stores the account ID in the 'toggles' array.
     */
    toggle.onchange = function () {
      if (this.checked) {
        toggles.push(parseInt(this.id));
      } else {
        toggles = toggles.filter((id) => id != parseInt(this.id));
      }

      check_toggles();
    };
  }
};

/**
 * Toggles the switches based on the type of account.
 * @param {number} account_type The type of account to toggle.
 */
function toggle_switches(account_type) {
  toggle_switch_elements.forEach((toggle, index) => {
    // Only toggle the account if it is the correct type.
    if (types[index] == account_type) {
      // Need to check/uncheck AND add/remove from toggles array.
      if (!toggle.checked) {
        toggle.checked = true;
        toggles.push(parseInt(toggle.id));
      }
    } else {
      toggle.checked = false;
      toggles = toggles.filter((id) => id != parseInt(toggle.id));
    }
  });
}

/**
 * Turns all switches on.
 */
function turn_all_switches_on() {
  toggles = [];
  for (let i = 0; i < toggle_switch_elements.length; i++) {
    toggle_switch_elements[i].checked = true;
    toggles.push(parseInt(toggle_switch_elements[i].id));
  }
}

/**
 * Turns all switches off.
 */
function turn_all_switches_off() {
  for (let i = 0; i < toggle_switch_elements.length; i++) {
    toggle_switch_elements[i].checked = false;
  }
  toggles = [];
}

function toggle_single_switch(state, platform) {
  toggle_switch_elements.forEach((toggle, index) => {
    if (labels[index] == platform.toLowerCase()) {
      if (!toggle.checked && state == 1) {
        toggle.checked = true;
        toggles.push(parseInt(toggle.id));
      } else if (toggle.checked && state == 0) {
        toggle.checked = false;
        toggles = toggles.filter((id) => id != parseInt(toggle.id));
      }
    }
  });
}

/**
 * QR Code submission handler.
 * @param {Event} e The event to be handled.
 */
const onGenerateSubmit = async function (e) {
  e.preventDefault();

  // Call the /home/generate endpoint with the toggles array.
  fetch("/home/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: toggles }),
  })
    .then((response) => response.json())
    .then((url) => {
      // Clear the div's contents
      qrcode_div.innerHTML = "";

      // Create the QR code using the google charts api and the uuid.
      let qrcode = document.createElement("img");
      let qrcode_url = new URL("https://chart.googleapis.com/chart?");
      qrcode_url.searchParams.append("chs", size.value);
      qrcode_url.searchParams.append("cht", "qr");
      qrcode_url.searchParams.append("chl", url);
      qrcode_url.searchParams.append("choe", "UTF-8");
      qrcode.src = qrcode_url.toString();
      qrcode.alt = "QR Code";

      // Append the QR Code inside the qrcode div
      qrcode_div.appendChild(qrcode);

      console.log(url);
      alert(url);
    });
};

// Add event listeners for submit and toggle buttons.
qrcode_submit.onclick = onGenerateSubmit;
casual_btn.onclick = function () {
  toggle_switches(0);
  check_toggles();
};
professional_btn.onclick = function () {
  toggle_switches(1);
  check_toggles();
};
all_btn.onclick = function () {
  turn_all_switches_on();
  check_toggles();
};
none_btn.onclick = function () {
  turn_all_switches_off();
  check_toggles();
};

//SPEECH RECOGNITION

if ("webkitSpeechRecognition" in window) {
  // Initialize webkitSpeechRecognition
  let speechRecognition = new webkitSpeechRecognition();

  // String for the Final Transcript
  let final_transcript = "";

  // Set the properties for the Speech Recognition object
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "en-US";

  // Callback Function for the onStart Event
  speechRecognition.onstart = () => {
    // Show the Status Element
    document.querySelector("#status").style.display = "block";
  };
  speechRecognition.onerror = () => {
    // Hide the Status Element
    document.querySelector("#status").style.display = "none";
  };
  speechRecognition.onend = () => {
    // Hide the Status Element
    document.querySelector("#status").style.display = "none";
  };

  speechRecognition.onresult = (event) => {
    // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interim_transcript = "";

    // Loop through the results from the speech recognition object.
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
        final_transcript = final_transcript.trim();
        let final_transcript_array = final_transcript.split(" ");
        if (
          final_transcript_array.length == 3 &&
          final_transcript_array[0] == "turn" &&
          final_transcript_array[1] == "on"
        ) {
          toggle_single_switch(1, final_transcript_array[2]);
        } else if (
          final_transcript_array.length == 3 &&
          final_transcript_array[0] == "turn" &&
          final_transcript_array[1] == "off"
        ) {
          toggle_single_switch(0, final_transcript_array[2]);
        } else if (
          final_transcript_array.length == 1 &&
          final_transcript_array[0] == "all"
        ) {
          turn_all_switches_on();
        } else if (
          final_transcript_array.length == 1 &&
          final_transcript_array[0] == "none"
        ) {
          turn_all_switches_off();
        } else if (
          final_transcript_array.length == 1 &&
          final_transcript_array[0] == "professional"
        ) {
          toggle_switches(1);
        } else if (
          final_transcript_array.length == 1 &&
          final_transcript_array[0] == "casual"
        ) {
          toggle_switches(0);
        } else if (
          final_transcript_array.length == 1 &&
          final_transcript_array[0] == "generate"
        ) {
          qrcode_submit.click();
        } else if (
          final_transcript_array.length == 2 &&
          final_transcript_array[0] == "generate" &&
          final_transcript_array[1] == "casual"
        ) {
          toggle_switches(0);
          setTimeout(function () {
            qrcode_submit.click();
          }, 1000);
        } else if (
          final_transcript_array.length == 2 &&
          final_transcript_array[0] == "generate" &&
          final_transcript_array[1] == "professional"
        ) {
          toggle_switches(1);
          setTimeout(function () {
            qrcode_submit.click();
          }, 1000);
        } else if (
          final_transcript_array.length == 2 &&
          final_transcript_array[0] == "generate" &&
          final_transcript_array[1] == "all"
        ) {
          turn_all_switches_on();
          setTimeout(function () {
            qrcode_submit.click();
          }, 1000);
        }
        check_toggles();
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    // Set the Final transcript and Interim transcript.
    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
  };

  document.querySelector("#microphone").onclick = () => {
    // Start the Speech Recognition
    isTalking = !isTalking;
    if (isTalking) {
      speechRecognition.start();
      mic_icon.classList.add("red-mic");
    } else {
      speechRecognition.stop();
      mic_icon.classList.remove("red-mic");
    }
  };
} else {
  console.log("Speech Recognition Not Available");
}
