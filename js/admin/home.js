/* Staff Overview page (admin/home.html). */

/* ---- settings and saved-data names ---- */
var KEY_APPS = "cl_apps";
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


function byId(id) {
  return document.getElementById(id);
}


/* ---- login check ---- */
// Every staff page runs this first. Not signed in means back to login.
function guard() {
  if (sessionStorage.getItem(KEY_ADMIN) !== "yes") {
    window.location.href = "login.html";
  }
}


/* ---- this page ---- */

function countPending(apps) {
  var count = 0;
  for (var i = 0; i < apps.length; i++) {
    if (apps[i].status === "Pending") {
      count++;
    }
  }
  return count;
}


function loansOnLoan(loans) {
  var result = [];
  for (var i = 0; i < loans.length; i++) {
    if (loans[i].status === "On loan") {
      result.push(loans[i]);
    }
  }
  return result;
}


function countDueTomorrow(loans) {
  var count = 0;
  for (var i = 0; i < loans.length; i++) {
    if (daysBetween(getToday(), loans[i].due) === 1) {
      count++;
    }
  }
  return count;
}


function countOverdue(loans) {
  var count = 0;
  for (var i = 0; i < loans.length; i++) {
    if (getToday() > loans[i].due) {
      count++;
    }
  }
  return count;
}


function initOverview() {
  guard();

  var apps = loadList(KEY_APPS);
  var onLoan = loansOnLoan(loadList(KEY_LOANS));

  byId("cWaiting").textContent = countPending(apps);
  byId("cLoans").textContent = onLoan.length;
  byId("cTomorrow").textContent = countDueTomorrow(onLoan);
  byId("cOverdue").textContent = countOverdue(onLoan);
  byId("workDate").value = getToday();

  // A working date lets us test the day-6 reminder without waiting.
  byId("dateForm").addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.setItem(KEY_DATE, byId("workDate").value);
    window.location.reload();
  });

  byId("dateReset").addEventListener("click", function () {
    localStorage.removeItem(KEY_DATE);
    window.location.reload();
  });
}


initOverview();
