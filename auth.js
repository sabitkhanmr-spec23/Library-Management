/* ==========================================================
   auth.js  -  JavaScript for the LOGIN and REGISTER pages only
   Library Management System | Web Technologies | Group 03

   Used by: login.html and register.html

   FORM VALIDATION : validateLogin(), validateRegister()
   DOM MANIPULATION: showGreeting(), showError(), clearErrors(),
                     togglePassword()
   ========================================================== */


/* ---------- DATA ----------
   An array of objects: the users who are allowed to login.
   (Demo only. A real website checks this on the server.)  */
let users = [
  { username: "admin",   password: "admin123" },
  { username: "student", password: "student1" },
  { username: "rahim",   password: "rahim123" }
];


/* ==========================================================
   PART 1: SHARED DOM FUNCTIONS (used by both pages)
   ========================================================== */

// Write a red message under a field and make its border red.
// inputId = id of the input. The error <span> must be: inputId + "Error"
function showError(inputId, message) {
  document.getElementById(inputId + "Error").innerHTML = message;
  document.getElementById(inputId).style.borderColor = "red";
}

// Remove the old error messages and red borders.
// idList = array of input ids, for example ["loginUser", "loginPass"]
function clearErrors(idList) {
  for (let i = 0; i < idList.length; i++) {
    document.getElementById(idList[i] + "Error").innerHTML = "";
    document.getElementById(idList[i]).style.borderColor = "gray";
  }
}

// Show or hide a password.
// Changes the type of the input: "text" (letters) or "password" (dots)
function togglePassword(inputId, checkboxId) {
  let box = document.getElementById(inputId);

  if (document.getElementById(checkboxId).checked) {
    box.type = "text";
  } else {
    box.type = "password";
  }
}


/* ==========================================================
   PART 2: LOGIN PAGE  (login.html)
   ========================================================== */

// DOM manipulation + if / else:
// writes Good Morning / Afternoon / Evening in <h3 id="greeting">
function showGreeting() {
  let hour = new Date().getHours();      // current hour, 0 to 23
  let greeting;

  if (hour < 12) {
    greeting = "Good Morning!";
  } else if (hour < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  document.getElementById("greeting").innerHTML = greeting + " Please login to continue.";
}

// FORM VALIDATION for the login form:
//   <form action="Library.html" onsubmit="return validateLogin()">
// return true  -> the form is sent, the browser opens Library.html (Home page)
// return false -> the form is NOT sent, the user stays on this page
function validateLogin() {
  // read what the user typed
  let username = document.getElementById("loginUser").value;
  let password = document.getElementById("loginPass").value;
  let valid = true;                      // becomes false if any rule fails

  // remove the old messages first
  clearErrors(["loginUser", "loginPass"]);
  document.getElementById("loginMessage").innerHTML = "";

  // ----- rules for the username -----
  if (username == "") {
    showError("loginUser", "Username is required");
    valid = false;
  } else if (username.length < 3) {
    showError("loginUser", "Username must be at least 3 characters");
    valid = false;
  }

  // ----- rules for the password -----
  if (password == "") {
    showError("loginPass", "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showError("loginPass", "Password must be at least 6 characters");
    valid = false;
  }

  // if a rule failed, stay on this page
  if (valid == false) {
    return false;
  }

  // ----- check the username and password in the users array -----
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username && users[i].password == password) {
      alert("Login successful! Welcome, " + username);
      return true;                       // go to the Home page
    }
  }

  // the loop finished: no user matched
  let message = document.getElementById("loginMessage");
  message.innerHTML = "Invalid username or password";
  message.style.color = "red";
  return false;
}


/* ==========================================================
   PART 3: REGISTER PAGE  (register.html)
   ========================================================== */

// FORM VALIDATION for the registration form:
//   <form action="login.html" onsubmit="return validateRegister()">
// return true  -> the form is sent, the browser opens login.html
// return false -> the form is NOT sent, the user stays on this page
function validateRegister() {
  // read the values from the form
  let fullName = document.getElementById("fullName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let terms = document.getElementById("terms").checked;   // true if ticked
  let valid = true;                      // becomes false if any rule fails

  // remove the old messages first
  clearErrors(["fullName", "email", "password", "confirmPassword"]);
  document.getElementById("termsError").innerHTML = "";

  // ----- full name -----
  if (fullName == "") {
    showError("fullName", "Full name is required");
    valid = false;
  } else if (fullName.length < 3) {
    showError("fullName", "Name must be at least 3 characters");
    valid = false;
  }

  // ----- email -----
  if (email == "") {
    showError("email", "Email is required");
    valid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    showError("email", "Enter a valid email, like name@mail.com");
    valid = false;
  }

  // ----- password -----
  if (password == "") {
    showError("password", "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters");
    valid = false;
  }

  // ----- confirm password: must be the same as the password -----
  if (confirmPassword == "") {
    showError("confirmPassword", "Please confirm your password");
    valid = false;
  } else if (confirmPassword != password) {
    showError("confirmPassword", "Passwords do not match");
    valid = false;
  }

  // ----- terms checkbox must be ticked -----
  if (terms == false) {
    document.getElementById("termsError").innerHTML = "You must agree to continue";
    valid = false;
  }

  if (valid == true) {
    alert("Registration successful! Please login.");
  }

  return valid;
}
