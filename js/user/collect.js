/* Collect with Token page (user/collect.html). */

/* ---- settings and saved-data names ---- */
var KEY_APPS = "cl_apps";
var KEY_LOANS = "cl_loans";
var KEY_DATE = "cl_date";
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


function sameText(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
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


// Makes numbers like A-101, A-102 from the size of the list.
function makeNumber(prefix, firstNumber, list) {
  return prefix + "-" + (firstNumber + list.length);
}


function findApplicationByToken(apps, token) {
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].token === token) {
      return apps[i];
    }
  }
  return null;
}


/* ---- this page ---- */

// Returns a problem text, or "" if the token can be used.
function checkToken(app, memberId) {
  if (app === null || !sameText(app.memberId, memberId)) {
    return "This token does not belong to that member ID.";
  }
  if (app.used) {
    return "This token has already been used.";
  }
  if (getToday() > app.validUntil) {
    return "This token expired on " + prettyDate(app.validUntil) + ". Please apply again.";
  }
  return "";
}


function makeLoan(app, loans) {
  return {
    no: makeNumber("L", 301, loans),
    token: app.token,
    memberId: app.memberId,
    name: app.name,
    title: app.title,
    collected: getToday(),
    due: addDays(getToday(), LOAN_DAYS),
    status: "On loan",      // later Returned
    returnedOn: ""
  };
}


function initCollect() {
  byId("collectForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var memberId = byId("cm").value.trim();
    var token = byId("ct").value.trim().toUpperCase();
    var apps = loadList(KEY_APPS);
    var app = findApplicationByToken(apps, token);

    var problem = checkToken(app, memberId);
    if (problem !== "") {
      showMessage(problem, false);
      return;
    }

    var loans = loadList(KEY_LOANS);
    var loan = makeLoan(app, loans);
    loans.push(loan);
    app.used = true;              // the token can not be used again
    saveList(KEY_LOANS, loans);
    saveList(KEY_APPS, apps);

    byId("collectForm").reset();
    showMessage("Collected \"" + loan.title + "\". Please return it by " + prettyDate(loan.due) + ".", true);
  });
}


initCollect();
