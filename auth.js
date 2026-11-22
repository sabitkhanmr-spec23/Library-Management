
let users = [
  { username: "admin",   password: "admin123" },
  { username: "student", password: "student1" },
  { username: "rahim",   password: "rahim123" }
];


function showError(inputId, message) {
  document.getElementById(inputId + "Error").innerHTML = message;
  document.getElementById(inputId).style.borderColor = "red";
}


function clearErrors(idList) {
  for (let i = 0; i < idList.length; i++) {
    document.getElementById(idList[i] + "Error").innerHTML = "";
    document.getElementById(idList[i]).style.borderColor = "gray";
  }
}


function togglePassword(inputId, checkboxId) {
  let box = document.getElementById(inputId);

  if (document.getElementById(checkboxId).checked) {
    box.type = "text";
  } else {
    box.type = "password";
  }
}



function showGreeting() {
  let hour = new Date().getHours();      
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


function validateLogin() {
  
  let username = document.getElementById("loginUser").value;
  let password = document.getElementById("loginPass").value;
  let valid = true;                      
  clearErrors(["loginUser", "loginPass"]);
  document.getElementById("loginMessage").innerHTML = "";


  if (username == "") {
    showError("loginUser", "Username is required");
    valid = false;
  } else if (username.length < 3) {
    showError("loginUser", "Username must be at least 3 characters");
    valid = false;
  }

  if (password == "") {
    showError("loginPass", "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showError("loginPass", "Password must be at least 6 characters");
    valid = false;
  }

  
  if (valid == false) {
    return false;
  }

 
  for (let i = 0; i < users.length; i++) {
    if (users[i].username == username && users[i].password == password) {
      alert("Login successful! Welcome, " + username);
      return true;                    
    }
  }

  
  let message = document.getElementById("loginMessage");
  message.innerHTML = "Invalid username or password";
  message.style.color = "red";
  return false;
}



function validateRegister() {
  
  let fullName = document.getElementById("fullName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let terms = document.getElementById("terms").checked;   
  let valid = true;                     

  
  clearErrors(["fullName", "email", "password", "confirmPassword"]);
  document.getElementById("termsError").innerHTML = "";


  if (fullName == "") {
    showError("fullName", "Full name is required");
    valid = false;
  } else if (fullName.length < 3) {
    showError("fullName", "Name must be at least 3 characters");
    valid = false;
  }

 
  if (email == "") {
    showError("email", "Email is required");
    valid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    showError("email", "Enter a valid email, like name@mail.com");
    valid = false;
  }

  if (password == "") {
    showError("password", "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showError("password", "Password must be at least 6 characters");
    valid = false;
  }


  if (confirmPassword == "") {
    showError("confirmPassword", "Please confirm your password");
    valid = false;
  } else if (confirmPassword != password) {
    showError("confirmPassword", "Passwords do not match");
    valid = false;
  }

  if (terms == false) {
    document.getElementById("termsError").innerHTML = "You must agree to continue";
    valid = false;
  }

  if (valid == true) {
    alert("Registration successful! Please login.");
  }

  return valid;
}
