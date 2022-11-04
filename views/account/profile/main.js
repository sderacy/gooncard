let live_alert_placeholder = document.getElementById("live-alert-placeholder");
let accounts_table = document.getElementById("accounts-table-body");
let add_new_label = document.getElementById("add-new-label");
let add_new_value = document.getElementById("add-new-value");
let add_new_account_submit = document.getElementById("add-new-account-submit");

// These are dummy values for now; we would need to pull the casual and professional info from the db
let labels = ["Instagram", "Facebook", "Email", "LinkedIn"];
let values = [
  "lelekaz",
  "Leah Kazenmayer",
  "kazenml1@tcnj.edu",
  "https://www.linkedin.com/in/leah-kazenmayer/",
];

function add_row(table, label, value) {
  let tr = document.createElement("tr");
  let label_td = document.createElement("td");
  let label_input = document.createElement("input");
  label_input.classList.add("form-control");
  let value_td = document.createElement("td");
  let value_input = document.createElement("input");
  value_input.classList.add("form-control");
  let delete_td = document.createElement("td");

  let delete_btn = document.createElement("button");
  delete_btn.innerText = "Delete";
  delete_btn.classList.add("btn", "btn-danger", "btn-sm");

  label_input.value = label;
  label_td.appendChild(label_input);
  value_input.value = value;
  value_td.appendChild(value_input);

  delete_td.appendChild(delete_btn);

  tr.appendChild(label_td);
  tr.appendChild(value_td);
  tr.appendChild(delete_td);

  table.appendChild(tr);

  delete_btn.onclick = function () {
    if (confirm("Are you sure you want to delete this account information?")) {
      // REMOVE LABEL VALUE PAIR FROM THE DB
      table.removeChild(tr);
      alert(
        label_input.value +
          "+" +
          value_input.value +
          " pair deleted successfully!",
        "warning"
      );
    }
  };

  label_input.onchange = function () {
    // MODIFY LABEL IN THE DB
    alert("The new label is now: " + label_input.value, "warning");
  };

  value_input.onchange = function () {
    // MODIFY LABEL IN THE DB
    alert("The new value is now: " + value_input.value, "warning");
  };
}

function populate_table() {
  for (let i = 0; i < labels.length; i++) {
    add_row(accounts_table, labels[i], values[i]);
  }
}

const alert = (message, type) => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div id="dismissable-alert" class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  live_alert_placeholder.append(wrapper);

  $("#live-alert-placeholder")
    .fadeTo(1500, 500)
    .slideUp(500, function () {
      $("#live-alert-placeholder").slideUp(500);
      wrapper.innerHTML = "";
    });
};

add_new_account_submit.onclick = function () {
  if (add_new_label.value == "" || add_new_value.value == "") {
    alert(
      "Your label or value is empty. Fill in both to successfully add a new account.",
      "warning"
    );
  } else {
    // ADD LABEL VALUE PAIR IN THE DB
    add_row(accounts_table, add_new_label.value, add_new_value.value);
    add_new_label.value = "";
    add_new_value.value = "";
    alert("You successfully added a new account!", "warning");
  }
};

populate_table();
