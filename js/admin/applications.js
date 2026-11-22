/* Staff Applications page (admin/applications.html). */

/* ---- settings and saved-data names ---- */
var KEY_APPS = "cl_apps";
var KEY_DATE = "cl_date";
var KEY_ADMIN = "cl_admin";
var LOAN_DAYS = 7;     // token validity and loan length

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


function addDays(dateText, days) {
  var date = textToDate(dateText);
  date.setDate(date.getDate() + days);
  return dateToText(date);
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


function findApplicationByToken(apps, token) {
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].token === token) {
      return apps[i];
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

// Makes a token like TKN-4821 that no other application has.
function makeToken(apps) {
  var token = "";
  do {
    token = "TKN-" + (1000 + Math.floor(Math.random() * 9000));
  } while (findApplicationByToken(apps, token) !== null);
  return token;
}


function approveApplication(no) {
  var apps = loadList(KEY_APPS);
  var app = findByNo(apps, no);

  app.status = "Approved";
  app.token = makeToken(apps);
  app.issued = getToday();
  app.validUntil = addDays(getToday(), LOAN_DAYS);

  saveList(KEY_APPS, apps);
  showMessage("Approved " + no + ". Token " + app.token + " is valid until " + prettyDate(app.validUntil) + ".", true);
  drawApplications();
}


function rejectApplication(no) {
  var apps = loadList(KEY_APPS);
  var app = findByNo(apps, no);

  app.status = "Rejected";

  saveList(KEY_APPS, apps);
  showMessage("Rejected " + no + ".", true);
  drawApplications();
}


function drawWaitingTable(apps) {
  var body = byId("appBody");
  body.innerHTML = "";
  var found = 0;

  for (var i = 0; i < apps.length; i++) {
    var app = apps[i];
    if (app.status !== "Pending") {
      continue;
    }
    found++;

    var row = document.createElement("tr");
    addCell(row, app.no);
    addCell(row, app.name + " (" + app.memberId + ") " + app.email);
    addCell(row, app.title + " - " + app.code);
    addCell(row, prettyDate(app.applied));

    var buttonCell = document.createElement("td");
    addDecisionButtons(buttonCell, app.no);
    row.appendChild(buttonCell);
    body.appendChild(row);
  }

  if (found === 0) {
    addEmptyRow(body, 5, "No applications are waiting.");
  }
}


// A separate function so each button remembers its own application number.
function addDecisionButtons(cell, no) {
  addButton(cell, "Approve", function () { approveApplication(no); });
  cell.appendChild(document.createTextNode(" "));
  addButton(cell, "Reject", function () { rejectApplication(no); });
}


function drawDecidedTable(apps) {
  var body = byId("doneBody");
  body.innerHTML = "";
  var found = 0;

  for (var i = 0; i < apps.length; i++) {
    var app = apps[i];
    if (app.status === "Pending") {
      continue;
    }
    found++;

    var row = document.createElement("tr");
    addCell(row, app.no);
    addCell(row, app.name + " (" + app.memberId + ")");
    addCell(row, app.title);
    addCell(row, app.status);
    if (app.status === "Approved") {
      addCell(row, app.token + " (until " + prettyDate(app.validUntil) + ")");
    } else {
      addCell(row, "-");
    }
    body.appendChild(row);
  }

  if (found === 0) {
    addEmptyRow(body, 5, "Nothing decided yet.");
  }
}


function drawApplications() {
  var apps = loadList(KEY_APPS);
  drawWaitingTable(apps);
  drawDecidedTable(apps);
}


function initApplications() {
  guard();
  drawApplications();
}


initApplications();
