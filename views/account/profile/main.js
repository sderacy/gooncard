let accounts_table = document.getElementById("accounts-table-body");

// These are dummy values for now; we would need to pull the casual and professional info from the db
let labels = ["Instagram", "Facebook", "Email", "LinkedIn"];
let values = [
  "lelekaz",
  "Leah Kazenmayer",
  "kazenml1@tcnj.edu",
  "https://www.linkedin.com/in/leah-kazenmayer/",
];

function populate_table(table, labels, values) {
  for (let i = 0; i < labels.length; i++) {
    let tr = document.createElement("tr");
    let label = document.createElement("td");
    let label_input = document.createElement("input");
    label_input.classList.add('form-control');
    let value = document.createElement("td");
    let value_input = document.createElement("input");
    value_input.classList.add('form-control');
    let delete_td = document.createElement("td");

    let delete_btn = document.createElement("button");
    delete_btn.innerText = "Delete";
    delete_btn.classList.add("btn", "btn-danger", "btn-sm");

    delete_btn.onclick = function() {
      if (confirm("Are you sure you want to delete this account information?")) {
        location.reload();
      }
    }

    label_input.value = labels[i];
    label.appendChild(label_input);
    value_input.value = values[i];
    value.appendChild(value_input);

    delete_td.appendChild(delete_btn);

    tr.appendChild(label);
    tr.appendChild(value);
    tr.appendChild(delete_td);

    table.appendChild(tr);
  }
}

populate_table(accounts_table, labels, values);
