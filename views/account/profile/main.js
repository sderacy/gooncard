let accounts_table = document.getElementById("accounts-table-body");
let add_new_label = document.getElementById("add-new-label");
let add_new_value = document.getElementById("add-new-value");
let add_new_type = document.getElementById("add-new-type");
let add_new_account_submit = document.getElementById("add-new-account-submit");
let save_changes = document.getElementById("save-changes");
let cancel_changes = document.getElementById("cancel-changes");
const allTextboxes = [];
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

const printStatus = () => {
  console.log("add", add);
  console.log("edit", edit);
  console.log("remove", remove);
};

const updateFormButtons = () => {
  // If any text boxes are empty, disable the submit button.
  let submitDisabled = false;
  let cancelDisabled = true;
  let addDisabled = true;
  allTextboxes.forEach((textbox) => {
    if (textbox.value == "") {
      submitDisabled = true;
    }
  });

  // If add, edit, and delete arrays are empty, disable submit.
  if (add.length == 0 && edit.length == 0 && remove.length == 0) {
    submitDisabled = true;
  }

  // If some changes are present, enable cancel.
  else {
    cancelDisabled = false;
  }

  // If all of the new account fields are filled, disable add.
  if (
    add_new_label.value != "" &&
    add_new_value.value != "" &&
    add_new_type.value != ""
  ) {
    addDisabled = false;
  }

  // Set the state of the buttons accordingly.
  save_changes.disabled = submitDisabled;
  cancel_changes.disabled = cancelDisabled;
  add_new_account_submit.disabled = addDisabled;
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
  allTextboxes.push(label_input);
  label_input.classList.add("form-control");
  let value_td = document.createElement("td");
  let value_input = document.createElement("input");
  allTextboxes.push(value_input);
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
  const editRowAction = (id) => {
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

    // If we are dealing with a dummy ID, modify the account in the add array.
    else {
      const existing = add.find((e) => e.id === id);
      if (existing) {
        existing.label = label_input.value;
        existing.value = value_input.value;
        existing.type = toggle.checked ? 1 : 0;
      }
    }

    updateFormButtons();
    printStatus();
  };

  // When a row is deleted, need to take appropriate action.
  const deleteRowAction = (id) => {
    if (confirm("Are you sure you want to delete this account information?")) {
      // If we are dealing with a valid ID, then we are deleting an existing account.
      if (typeof id === "number") {
        // If the account is already in the edit array, remove it from the edit array.
        if (edit.find((obj) => obj.id == id)) {
          edit.splice(edit.indexOf(edit.find((obj) => obj.id == id)), 1);
        }
        // Always add the account to the remove array.
        remove.push(id);
      }

      // If we are dealing with a dummy ID, remove the account from the add array.
      else {
        add.splice(add.indexOf(add.find((obj) => obj.id == id)), 1);
      }

      // Finally, remove the row from the table.
      table.removeChild(tr);

      updateFormButtons();
      printStatus();
    }
  };

  label_input.oninput = () => editRowAction(id);
  value_input.oninput = () => editRowAction(id);
  toggle.onchange = () => editRowAction(id);
  delete_btn.onclick = () => deleteRowAction(id);
}

add_new_label.oninput = () => updateFormButtons();
add_new_value.oninput = () => updateFormButtons();
add_new_type.onchange = () => updateFormButtons();

/**
 * Adds a new row to the accounts table and event arrays.
 * This is used as the onlick handler by the 'new account' button.
 */
add_new_account_submit.onclick = () => {
  const id = getDummyId();
  add_row(
    accounts_table,
    add_new_label.value,
    add_new_value.value,
    add_new_type.value == "0" ? 0 : 1,
    id
  );

  // Additionally, add the new account to the add array.
  add.push({
    id,
    label: add_new_label.value,
    value: add_new_value.value,
    type: add_new_type.value == "0" ? 0 : 1,
  });

  // Reset the input fields.
  add_new_label.value = "";
  add_new_value.value = "";
  add_new_type.value = "";

  updateFormButtons();
  printStatus();
};

/**
 * Performs a page refresh in order to clear the user's input.
 */
cancel_changes.onclick = () => {
  if (
    confirm(
      "Are you sure you want to cancel? All changes since your last save will be lost."
    )
  ) {
    location.reload();
  }
};

/**
 * Performs client-side validation on the form.
 * If the form is valid, then the form is submitted.
 */
save_changes.onclick = async () => {
  // Send the data to the backend.
  const data = {
    add,
    edit,
    remove,
  };

  // Send the data to the backend, reload the page.
  fetch("/account/profile/update", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  }).then(() => {
    window.location.href = "/account/profile";
  });
};

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

// Populate the table with the user's accounts.
populate_table();
