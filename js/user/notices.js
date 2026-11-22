/* My Notices page (user/notices.html). */

/* ---- settings and saved-data names ---- */
var KEY_APPS = "cl_apps";
var KEY_LOANS = "cl_loans";
var KEY_DATE = "cl_date";
var REMIND_DAY = 6;    // reminder starts on day 6

/* ---- helper functions ---- */
function loadList(key) {
  var text = localStorage.getItem(key);
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
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


/* ---- this page ---- */

// The text that tells a member the state of one application.
function applicationText(app) {
  var text = app.no + " - " + app.title + ": " + app.status;
  if (app.status === "Approved" && app.used === false) {
    if (getToday() > app.validUntil) {
      text += ". Token " + app.token + " expired on " + prettyDate(app.validUntil) + ".";
    } else {
      text += ". Token " + app.token + " is valid until " + prettyDate(app.validUntil) + ".";
    }
  }
  if (app.used) {
    text += " (collected)";
  }
  return text;
}


// The text that tells a member what to do about one loan.
function loanText(loan) {
  if (loan.status === "Returned") {
    return "Returned on " + prettyDate(loan.returnedOn) + ". Thank you.";
  }
  var daysLeft = daysBetween(getToday(), loan.due);
  if (daysLeft < 0) {
    return "OVERDUE. It was due on " + prettyDate(loan.due) + ".";
  }
  if (daysLeft === 0) {
    return "Due today. Please return it now.";
  }
  var daysUsed = daysBetween(loan.collected, getToday());
  if (daysUsed >= REMIND_DAY) {
    return "Please return this book tomorrow (" + prettyDate(loan.due) + ").";
  }
  return "Due on " + prettyDate(loan.due) + " (" + daysLeft + " days left).";
}


function memberApplications(memberId) {
  var all = loadList(KEY_APPS);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (sameText(all[i].memberId, memberId)) {
      mine.push(all[i]);
    }
  }
  return mine;
}


function memberLoans(memberId) {
  var all = loadList(KEY_LOANS);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (sameText(all[i].memberId, memberId)) {
      mine.push(all[i]);
    }
  }
  return mine;
}


// Adds a heading and a bullet list to the results area.
function addSection(area, heading, lines) {
  var title = document.createElement("h2");
  title.textContent = heading;
  area.appendChild(title);

  var list = document.createElement("ul");
  for (var i = 0; i < lines.length; i++) {
    var item = document.createElement("li");
    item.textContent = lines[i];
    list.appendChild(item);
  }
  area.appendChild(list);
}


function initNotices() {
  byId("noticeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var memberId = byId("nm").value.trim();
    var area = byId("results");
    area.innerHTML = "";

    var apps = memberApplications(memberId);
    var loans = memberLoans(memberId);

    if (apps.length === 0 && loans.length === 0) {
      showMessage("No records for that member ID.", false);
      return;
    }
    showMessage("", true);

    var appLines = [];
    for (var i = 0; i < apps.length; i++) {
      appLines.push(applicationText(apps[i]));
    }

    var loanLines = [];
    for (var j = 0; j < loans.length; j++) {
      loanLines.push(loans[j].title + ": " + loanText(loans[j]));
    }
    if (loanLines.length === 0) {
      loanLines.push("No books on loan.");
    }

    addSection(area, "Applications", appLines);
    addSection(area, "Return Notices", loanLines);
  });
}


initNotices();
