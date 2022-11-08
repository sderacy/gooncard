let live_alert_placeholder = document.getElementById("live-alert-placeholder");
let accounts_table = document.getElementById("accounts-table-body");
let add_new_label = document.getElementById("add-new-label");
let add_new_value = document.getElementById("add-new-value");
let add_new_type = document.getElementById("add-new-type");
let add_new_account_submit = document.getElementById("add-new-account-submit");
let dummyCounter = 0;

// Fetch the user_accounts from the database.
let user_accounts = await (
  await fetch("/account/profile/getall", { method: "GET" })
).json();

// Make sure the settings are fetched.
const settings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();

// Apply the settings to the page.
var htmlElement = document.getElementById("html");
htmlElement.style.fontSize = settings.font_size;
htmlElement.style.fontFamily = settings.font_family;

// Create different event arrays for editing the accounts.
const add = [];
const edit = [];
const remove = [];

// Store the labels, values, types, and ids into separate arrays.
let labels = [];
let values = [];
let types = [];
let ids = [];
if (user_accounts) {
  user_accounts.forEach((account) => {
    labels.push(account.label);
    values.push(account.value);
    types.push(account.type);
    ids.push(account.id);
  });
}

const getDummyId = () => {
  dummyCounter++;
  return "dummy-" + dummyCounter;
};

/**
 * Adds a new row to the accounts table.
 * @param {HTMLTableElement} table The table to add the row to.
 * @param {string} label The label of the user_account.
 * @param {string} value The value of the user_account.
 * @param {number} id The ID of the user_account.
 */
function add_row(table, label, value, type, id) {
  let tr = document.createElement("tr");
  let label_td = document.createElement("td");
  let label_input = document.createElement("input");
  label_input.classList.add("form-control");
  let value_td = document.createElement("td");
  let value_input = document.createElement("input");
  value_input.classList.add("form-control");

  let type_td = document.createElement("td");
  let type_switch_div = document.createElement("div");
  type_switch_div.classList.add("form-check", "form-switch", "form-switch-m");
  let toggle = document.createElement("input");
  toggle.classList.add("form-check-input", "col-4");
  toggle.type = "checkbox";
  toggle.role = "switch";
  toggle.id = id;
  toggle.checked = type == 0 ? false : true;

  let delete_td = document.createElement("td");
  let delete_btn = document.createElement("button");
  delete_btn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  delete_btn.classList.add("btn", "btn-danger", "btn-sm");

  label_input.value = label;
  label_input.oldvalue = label;
  label_td.appendChild(label_input);
  value_input.value = value;
  value_input.oldvalue = value;
  value_td.appendChild(value_input);

  type_td.appendChild(type_switch_div);
  type_switch_div.appendChild(toggle);
  delete_td.appendChild(delete_btn);

  tr.appendChild(label_td);
  tr.appendChild(value_td);
  tr.appendChild(type_td);
  tr.appendChild(delete_td);

  table.appendChild(tr);

  // When a row is modified, need to take appropriate action.
  const editRow = (id) => {
    // If we are dealing with a valid ID, then we are editing an existing account.
    if (typeof id === "number") {
      // If the values are the same as the original, remove the object from the edit array.
      if (
        label_input.value == label &&
        value_input.value == value &&
        toggle.checked == (type == 0 ? false : true)
      ) {
        console.log("Back to original!");
        edit.splice(edit.indexOf(edit.find((obj) => obj.id == id)), 1);
      }
      // Otherwise, add or update the object in the edit array.
      else {
        // If the edit array contains an object with id, then we are editing an existing account.
        const existing = edit.find((e) => e.id === id);
        if (existing) {
          existing.label = label_input.value;
          existing.value = value_input.value;
          existing.type = toggle.checked ? 1 : 0;
        }
        // Otherwise, add the account to the edit array.
        else {
          edit.push({
            id: id,
            label: label_input.value,
            value: value_input.value,
            type: toggle.checked ? 1 : 0,
          });
        }
      }
    }

    // If we are dealing with a dummy ID, modify the accoun in the add array.
    else {
      const existing = add.find((e) => e.id === id);
      if (existing) {
        existing.label = label_input.value;
        existing.value = value_input.value;
        existing.type = toggle.checked ? 1 : 0;
      }
    }
    console.log("add:", add);
    console.log("edit", edit);
  };

  // When a row is deleted, need to take appropriate action.
  const deleteRow = (id) => {};

  label_input.oninput = () => editRow(id);
  value_input.oninput = () => editRow(id);
  toggle.onchange = () => editRow(id);
  delete_btn.onclick = () => deleteRow(id);
}

/**
 * Populates the accounts table with the user's accounts.
 *
 * At this point, all event listeners for input fields and buttons will
 * be added to each row, so that interaction communicates with the backend.
 */
function populate_table() {
  for (let i = 0; i < labels.length; i++) {
    add_row(accounts_table, labels[i], values[i], types[i], ids[i]);
  }
}

/**
 * Function for generating alert messages.
 * @param {string} message The message to display.
 * @param {string} type The type of alert to display.
 */
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

/**
 * 'Click' event listener for submitting new account information.
 */
add_new_account_submit.onclick = async function () {
  // Prevent submission if either label or value is empty.
  if (
    add_new_label.value == "" ||
    add_new_value.value == "" ||
    add_new_type.value == ""
  ) {
    alert(
      "Your label, value, or type is empty. Fill in all three to successfully add a new account.",
      "danger"
    );
  } else {
    const id = getDummyId();
    add_row(
      accounts_table,
      add_new_label.value,
      add_new_value.value,
      add_new_type.value,
      id
    );

    // Additionally, add the new account to the add array.
    add.push({
      label: add_new_label.value,
      value: add_new_value.value,
      type: add_new_type.value,
      id,
    });

    // Reset the input fields.
    add_new_label.value = "";
    add_new_value.value = "";
    add_new_type.value = "";
    alert("You successfully added a new account!", "warning");
  }
};

// Populate the table with the user's accounts.
populate_table();
