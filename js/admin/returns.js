/* Staff Loans and Returns page (admin/returns.html). */

/* ---- settings and saved-data names ---- */
var KEY_LOANS = "cl_loans";
var KEY_DATE = "cl_date";
var KEY_ADMIN = "cl_admin";

/* ---- helper functions ---- */
function loadList(key) {
  var text = localStorage.getItem(key);
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
}


function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}


function twoDigits(number) {
  if (number < 10) {
    return "0" + number;
  }
  return "" + number;
}


function dateToText(date) {
  return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
}


function textToDate(text) {
  var parts = text.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}


// Today is the real date, unless a working date was set.
function getToday() {
  var workingDate = localStorage.getItem(KEY_DATE);
  if (workingDate) {
    return workingDate;
  }
  return dateToText(new Date());
}


function daysBetween(fromText, toText) {
  var milliseconds = textToDate(toText) - textToDate(fromText);
  return Math.round(milliseconds / 86400000);
}


// "2026-10-26" becomes "Oct 26 2026"
function prettyDate(dateText) {
  return textToDate(dateText).toDateString().slice(4);
}


function byId(id) {
  return document.getElementById(id);
}


// Show a message in <p id="msg">. The CSS colours it using data-state.
function showMessage(text, isGood) {
  var box = byId("msg");
  box.textContent = text;
  if (isGood) {
    box.setAttribute("data-state", "ok");
  } else {
    box.setAttribute("data-state", "error");
  }
}


function addCell(row, text) {
  var cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
}


function addEmptyRow(tableBody, columns, text) {
  var row = document.createElement("tr");
  var cell = document.createElement("td");
  cell.colSpan = columns;
  cell.textContent = text;
  row.appendChild(cell);
  tableBody.appendChild(row);
}


function addButton(parent, text, whenClicked) {
  var button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", whenClicked);
  parent.appendChild(button);
}


function findByNo(list, no) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].no === no) {
      return list[i];
    }
  }
  return null;
}


/* ---- login check ---- */
// Every staff page runs this first. Not signed in means back to login.
function guard() {
  if (sessionStorage.getItem(KEY_ADMIN) !== "yes") {
    window.location.href = "login.html";
  }
}


/* ---- this page ---- */

function markReturned(no) {
  var loans = loadList(KEY_LOANS);
  var loan = findByNo(loans, no);

  loan.status = "Returned";       // this closes the token's case
  loan.returnedOn = getToday();

  saveList(KEY_LOANS, loans);
  showMessage("Loan " + no + " is marked as returned.", true);
  drawReturns();
}


function drawLoanTable(loans) {
  var body = byId("loanBody");
  body.innerHTML = "";
  var found = 0;

  for (var i = 0; i < loans.length; i++) {
    var loan = loans[i];
    if (loan.status !== "On loan") {
      continue;
    }
    found++;

    var state = "On loan";
    if (getToday() > loan.due) {
      state = "Overdue";
    }

    var row = document.createElement("tr");
    addCell(row, loan.no);
    addCell(row, loan.token);
    addCell(row, loan.name + " (" + loan.memberId + ")");
    addCell(row, loan.title);
    addCell(row, prettyDate(loan.collected));
    addCell(row, prettyDate(loan.due));
    addCell(row, state);

    var buttonCell = document.createElement("td");
    addReturnButton(buttonCell, loan.no);
    row.appendChild(buttonCell);
    body.appendChild(row);
  }

  if (found === 0) {
    addEmptyRow(body, 8, "No books are on loan.");
  }
}


function addReturnButton(cell, no) {
  addButton(cell, "Return", function () { markReturned(no); });
}


// Books due tomorrow. (The CSS shows a default text when the list is empty.)
function drawReminders(loans) {
  var list = byId("remindList");
  list.innerHTML = "";

  for (var i = 0; i < loans.length; i++) {
    var loan = loans[i];
    if (loan.status === "On loan" && daysBetween(getToday(), loan.due) === 1) {
      var item = document.createElement("li");
      item.textContent = loan.name + " (" + loan.memberId + ") must return " + loan.title + " on " + prettyDate(loan.due) + ".";
      list.appendChild(item);
    }
  }
}


function drawReturnedTable(loans) {
  var body = byId("pastBody");
  body.innerHTML = "";
  var found = 0;

  for (var i = 0; i < loans.length; i++) {
    var loan = loans[i];
    if (loan.status !== "Returned") {
      continue;
    }
    found++;

    var result = "Returned on time";
    if (loan.returnedOn > loan.due) {
      result = "Returned late";
    }

    var row = document.createElement("tr");
    addCell(row, loan.no);
    addCell(row, loan.name + " (" + loan.memberId + ")");
    addCell(row, loan.title);
    addCell(row, prettyDate(loan.returnedOn));
    addCell(row, result);
    body.appendChild(row);
  }

  if (found === 0) {
    addEmptyRow(body, 5, "No returns yet.");
  }
}


function drawReturns() {
  var loans = loadList(KEY_LOANS);
  drawLoanTable(loans);
  drawReminders(loans);
  drawReturnedTable(loans);
}


function initReturns() {
  guard();
  drawReturns();
}


initReturns();
