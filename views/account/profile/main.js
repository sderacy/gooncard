// JQuery Datatables Initialization
$(document).ready(function () {
  var table = $("#casual-table").DataTable();
  new $.fn.DataTable.Responsive(table);
});
$(document).ready(function () {
  var table = $("#professional-table").DataTable();
  new $.fn.DataTable.Responsive(table);
});

let casual_table = document.getElementById("casual-table-body");
let professional_table = document.getElementById("professional-table-body");

// These are dummy values for now; we would need to pull the casual and professional info from the db
let casual_data_labels = ["Instagram", "Facebook"];
let casual_data_values = ["lelekaz", "Leah Kazenmayer"];

let professional_data_labels = ["Email", "LinkedIn"];
let professional_data_values = [
  "kazenml1@tcnj.edu",
  "https://www.linkedin.com/in/leah-kazenmayer/",
];

function populate_table(table, labels, values) {
  for (let i = 0; i < labels.length; i++) {
    let tr = document.createElement("tr");
    let label = document.createElement("td");
    let value = document.createElement("td");
    let action = document.createElement("td");
    let edit_btn = document.createElement("button");

    edit_btn.innerText = "Edit";
    edit_btn.classList.add("btn", "btn-warning", "btn-sm");
    let delete_btn = document.createElement("button");
    delete_btn.innerText = "Delete";
    delete_btn.classList.add("btn", "btn-danger", "btn-sm");

    label.innerText = labels[i];
    value.innerText = values[i];
    action.appendChild(edit_btn);
    action.appendChild(delete_btn);

    tr.appendChild(label);
    tr.appendChild(value);
    tr.appendChild(action);

    table.appendChild(tr);
  }
}

populate_table(casual_table, casual_data_labels, casual_data_values);
populate_table(
  professional_table,
  professional_data_labels,
  professional_data_values
);
