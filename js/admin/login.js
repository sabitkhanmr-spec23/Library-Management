/* Staff Login page (admin/login.html). */

/* ---- settings and saved-data names ---- */
var KEY_ADMIN = "cl_admin";

/* ---- helper functions ---- */
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


/* ---- this page ---- */

var ADMIN_USER = "admin";
var ADMIN_PASS = "admin123";

function initLogin() {
  sessionStorage.removeItem(KEY_ADMIN);   // opening the login page signs you out

  byId("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var username = byId("u").value;
    var password = byId("p").value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(KEY_ADMIN, "yes");
      window.location.href = "home.html";
    } else {
      showMessage("Wrong username or password.", false);
    }
  });
}


initLogin();
