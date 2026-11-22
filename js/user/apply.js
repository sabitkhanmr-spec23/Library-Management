/* Apply for a Book page (user/apply.html). */

/* ---- settings and saved-data names ---- */
var KEY_APPS = "cl_apps";
var KEY_DATE = "cl_date";

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


// Today is the real date, unless a working date was set.
function getToday() {
  var workingDate = localStorage.getItem(KEY_DATE);
  if (workingDate) {
    return workingDate;
  }
  return dateToText(new Date());
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


/* ---- this page ---- */

// True if this member already has an open request for this book.
function hasOpenApplication(apps, memberId, bookCode) {
  for (var i = 0; i < apps.length; i++) {
    var app = apps[i];
    var sameMember = sameText(app.memberId, memberId);
    var sameBook = sameText(app.code, bookCode);
    var stillOpen = (app.status === "Pending") || (app.status === "Approved" && app.used === false);
    if (sameMember && sameBook && stillOpen) {
      return true;
    }
  }
  return false;
}


function makeApplication(apps) {
  return {
    no: makeNumber("A", 101, apps),
    name: byId("name").value.trim(),
    memberId: byId("mid").value.trim(),
    email: byId("mail").value.trim(),
    title: byId("bt").value.trim(),
    code: byId("bc").value.trim(),
    applied: getToday(),
    status: "Pending",      // later Approved or Rejected
    token: "",
    issued: "",
    validUntil: "",
    used: false             // true after the book is collected
  };
}


function initApply() {
  byId("applyForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var apps = loadList(KEY_APPS);
    var memberId = byId("mid").value.trim();
    var bookCode = byId("bc").value.trim();

    if (hasOpenApplication(apps, memberId, bookCode)) {
      showMessage("You already have an open application for this book.", false);
      return;
    }

    var newApp = makeApplication(apps);
    apps.push(newApp);
    saveList(KEY_APPS, apps);

    byId("applyForm").reset();
    showMessage("Application " + newApp.no + " sent. Wait for the librarian to approve it, then check My Notices for your token.", true);
  });
}


initApply();
