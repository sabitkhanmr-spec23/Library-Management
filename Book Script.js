

var totalBooks = 4;   
var validCategories = ["all", "science", "technology", "fiction", "history"];




function showError(inputId, errorId, message) {
  document.getElementById(errorId).textContent = message;   
  document.getElementById(inputId).className = "invalid";   
}

function clearErrors() {
  document.getElementById("searchError").textContent = "";
  document.getElementById("categoryError").textContent = "";
  document.getElementById("searchBox").className = "";
  document.getElementById("categoryFilter").className = "";
}


/* ---------- 1. Validate the search box ---------- */

function validateSearchText(text) {
  var badChars = "<>@#$%^*=+{}[]|~`";

  
  if (text.length == 0) {
    return true;
  }

  
  if (text.length < 2) {
    showError("searchBox", "searchError", "Please enter at least 2 characters.");
    return false;
  }

  
  for (var i = 0; i < text.length; i++) {
    if (badChars.indexOf(text.charAt(i)) != -1) {
      showError("searchBox", "searchError", "Symbols like < > @ # $ are not allowed.");
      return false;
    }
  }

  return true;
}


/* ---------- 2. Validate the category ---------- */

function validateCategory(category) {
  
  if (category == "") {
    return true;
  }

  for (var i = 0; i < validCategories.length; i++) {
    if (category == validCategories[i]) {
      return true;
    }
  }

  showError("categoryFilter", "categoryError",
            "Choose one of: All, Science, Technology, Fiction, History.");
  return false;
}


/* ---------- 4. Search and filter the books ---------- */

function searchBooks() {
  clearErrors();

 
  var text = document.getElementById("searchBox").value.trim().toLowerCase();
  var category = document.getElementById("categoryFilter").value.trim().toLowerCase();
  var availableOnly = document.getElementById("availableOnly").checked;

  
  var textOk = validateSearchText(text);
  var categoryOk = validateCategory(category);

  if (textOk == false || categoryOk == false) {
    return;   // stop here, do not filter
  }

 
  for (var i = 1; i <= totalBooks; i++) {
    var title = document.getElementById("title" + i).textContent.toLowerCase();
    var author = document.getElementById("author" + i).textContent.toLowerCase();
    var bookCategory = document.getElementById("category" + i).textContent.toLowerCase();
    var status = document.getElementById("status" + i).className;

    var show = true;

    
    if (title.indexOf(text) == -1 && author.indexOf(text) == -1) {
      show = false;
    }

    
    if (category != "" && category != "all" && bookCategory != category) {
      show = false;
    }

    
    if (availableOnly == true && status != "status available") {
      show = false;
    }

    
    if (show == true) {
      document.getElementById("book" + i).style.display = "";
    } else {
      document.getElementById("book" + i).style.display = "none";
    }
  }

  updateSummary();
}


/* ---------- Update the summary and the "No books found" message ---------- */

function updateSummary() {
  var total = 0;
  var available = 0;
  var borrowed = 0;

  for (var i = 1; i <= totalBooks; i++) {
    var card = document.getElementById("book" + i);

    if (card.style.display != "none") {
      total++;

      if (document.getElementById("status" + i).className == "status available") {
        available++;
      } else {
        borrowed++;
      }
    }
  }

  document.getElementById("totalBooks").textContent = total;
  document.getElementById("availableBooks").textContent = available;
  document.getElementById("borrowedBooks").textContent = borrowed;

  
  if (total == 0) {
    document.getElementById("noResults").style.display = "block";
  } else {
    document.getElementById("noResults").style.display = "none";
  }
}


/* ---------- 7. Borrow a book ---------- */

function borrowBook(number) {
  var status = document.getElementById("status" + number);
  var button = document.getElementById("btn" + number);

 
  status.className = "status borrowed";
  status.textContent = "Borrowed";

  
  button.textContent = "Not Available";
  button.disabled = true;

 
  if (document.getElementById("availableOnly").checked == true) {
    document.getElementById("book" + number).style.display = "none";
  }

  updateSummary();
}


/* ---------- 9. Reset the search ---------- */

function resetSearch() {
  document.getElementById("searchBox").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("availableOnly").checked = false;

  clearErrors();


  for (var i = 1; i <= totalBooks; i++) {
    document.getElementById("book" + i).style.display = "";
  }

  updateSummary();
}
