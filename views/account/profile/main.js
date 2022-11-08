let live_alert_placeholder = document.getElementById("live-alert-placeholder");
let accounts_table = document.getElementById("accounts-table-body");
let add_new_label = document.getElementById("add-new-label");
let add_new_value = document.getElementById("add-new-value");
let add_new_type = document.getElementById("add-new-type");
let add_new_account_submit = document.getElementById("add-new-account-submit");

// Fetch the user_accounts from the database.
let user_accounts = await (
  await fetch("/account/profile/getall", { method: "GET" })
).json();

let settings = await (
  await fetch("/account/profile/getsettings", { method: "GET" })
).json();

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
  let type_btn = document.createElement("button");
  type_btn.innerText = type == 0 ? "Casual" : "Professional";
  type_btn.value = type;
  type_btn.classList.add("btn", "btn-warning", "update", "btn-sm");

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

  type_td.appendChild(type_btn);
  delete_td.appendChild(delete_btn);

  tr.appendChild(label_td);
  tr.appendChild(value_td);
  tr.appendChild(type_td);
  tr.appendChild(delete_td);

  table.appendChild(tr);

  /**
   * 'Change' event listener for updating an account label and values.
   *
   * If a change fails, the input field will be reverted to its previous value.
   * This prevents accidental updates in the database if type is changed when
   * a textbox is blank.
   */
  const changeFunction = async function () {
    // Only proceed if the values are not empty.
    if (label_input.value != "" && value_input.value != "") {
      const response = await (
        await fetch("/account/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id,
            label: label_input.value,
            value: value_input.value,
            type: type_btn.value,
          }),
        })
      ).json();

      // If the account was successfully updated, display a success message.
      if (response) {
        alert(
          "The new account is: " + label_input.value + ": " + value_input.value,
          "warning"
        );

        // Should update the oldvalue to the new value.
        label_input.oldvalue = label_input.value;
        value_input.oldvalue = value_input.value;
      }

      // If the account was not successfully updated, display an error message.
      else {
        alert("An error occurred while updating the label.", "danger");

        // Should reset the values to their previous values.
        label_input.value = label_input.oldvalue;
        value_input.value = value_input.oldvalue;
      }
    }

    // If the values are empty, display an error message.
    else {
      alert("The label and value cannot be empty.", "danger");

      // Should reset the values to their previous values.
      label_input.value = label_input.oldvalue;
      value_input.value = value_input.oldvalue;
    }
  };

  label_input.onchange = changeFunction;
  value_input.onchange = changeFunction;

  /**
   * 'Click' event listener for the updating an account type.
   */
  type_btn.onclick = async function () {
    const response = await (
      await fetch("/account/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          label: label_input.value,
          value: value_input.value,
          type: type_btn.value == 0 ? 1 : 0,
        }),
      })
    ).json();

    // If the update was successful, update the button text.
    if (response) {
      if (type_btn.value == 0) {
        type_btn.value = 1;
        type_btn.innerText = "Professional";
      } else {
        type_btn.value = 0;
        type_btn.innerText = "Casual";
      }
    }

    // Otherwise display an error message.
    else {
      alert("There was an error updating the account type.", "danger");
    }
  };

  /**
   * 'Click' event listener for deleting an account.
   *
   * Calls the API endpoint with the row's ID.
   */
  delete_btn.onclick = async function () {
    if (confirm("Are you sure you want to delete this account information?")) {
      // Try to delete the account in the database.
      const response = await (
        await fetch("/account/profile/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        })
      ).json();

      // If the account was successfully deleted, remove the row from the table.
      if (response) {
        table.removeChild(tr);
        alert(
          label_input.value +
            "+" +
            value_input.value +
            " pair deleted successfully!",
          "warning"
        );
      }

      // If the account was not successfully deleted, display an error message.
      else {
        alert(
          "An error occurred while deleting " +
            label_input.value +
            "+" +
            value_input.value +
            " pair.",
          "danger"
        );
      }
    }
  };
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
 * 'Click' event listener for toggling new account type.
 */
add_new_type.onclick = function () {
  if (add_new_type.value == 0) {
    add_new_type.value = 1;
    add_new_type.innerText = "Professional";
  } else {
    add_new_type.value = 0;
    add_new_type.innerText = "Casual";
  }
};

/**
 * 'Click' event listener for submitting new account information.
 */
add_new_account_submit.onclick = async function () {
  // Prevent submission if either label or value is empty.
  if (add_new_label.value == "" || add_new_value.value == "") {
    alert(
      "Your label or value is empty. Fill in both to successfully add a new account.",
      "danger"
    );
  }

  // Attempt a database insertion.
  else {
    // Make the call to the API endpoint for adding a new account.
    const response = await (
      await fetch("/account/profile/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: add_new_label.value,
          value: add_new_value.value,
          type: add_new_type.value,
        }),
      })
    ).json();

    // If it was successful, alert the user and clear the form.
    if (response) {
      add_row(
        accounts_table,
        add_new_label.value,
        add_new_value.value,
        add_new_type.value,
        response.id
      );
      add_new_label.value = "";
      add_new_value.value = "";
      alert("You successfully added a new account!", "warning");
    }

    // If it was not successful, alert the user.
    else {
      alert(
        "There was an error adding your account. Please try again later.",
        "danger"
      );
    }
  }
};

// Populate the table with the user's accounts.
populate_table();
