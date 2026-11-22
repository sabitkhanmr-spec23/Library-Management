/* =====================================================
   Book Catalogue - JavaScript (simple version)

   Every book uses numbered ids in the HTML:
     book1, title1, author1, category1, status1, btn1 ...
   so the script can loop from 1 to 4 and find each part.
   ===================================================== */

var totalBooks = 4;   // number of book cards in the page
var validCategories = ["all", "science", "technology", "fiction", "history"];


/* ---------- Show / clear error messages ---------- */

function showError(inputId, errorId, message) {
  document.getElementById(errorId).textContent = message;   // write the message
  document.getElementById(inputId).className = "invalid";   // red border (CSS)
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

  // empty is allowed (it means "show all books")
  if (text.length == 0) {
    return true;
  }

  // too short
  if (text.length < 2) {
    showError("searchBox", "searchError", "Please enter at least 2 characters.");
    return false;
  }

  // invalid symbols: check every character one by one
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
  // empty is allowed (it means all categories)
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

  // read what the user typed (lower case so capitals do not matter)
  var text = document.getElementById("searchBox").value.trim().toLowerCase();
  var category = document.getElementById("categoryFilter").value.trim().toLowerCase();
  var availableOnly = document.getElementById("availableOnly").checked;

  // check both fields first, so both errors can show together
  var textOk = validateSearchText(text);
  var categoryOk = validateCategory(category);

  if (textOk == false || categoryOk == false) {
    return;   // stop here, do not filter
  }

  // go through book1, book2, book3, book4
  for (var i = 1; i <= totalBooks; i++) {
    var title = document.getElementById("title" + i).textContent.toLowerCase();
    var author = document.getElementById("author" + i).textContent.toLowerCase();
    var bookCategory = document.getElementById("category" + i).textContent.toLowerCase();
    var status = document.getElementById("status" + i).className;

    var show = true;

    // text must be inside the title or the author
    if (title.indexOf(text) == -1 && author.indexOf(text) == -1) {
      show = false;
    }

    // category must match (unless it is empty or "all")
    if (category != "" && category != "all" && bookCategory != category) {
      show = false;
    }

    // "available only" hides borrowed books
    if (availableOnly == true && status != "status available") {
      show = false;
    }

    // show or hide the card
    if (show == true) {
      document.getElementById("book" + i).style.display = "";
    } else {
      document.getElementById("book" + i).style.display = "none";
    }
  }

  updateSummary();
}


/* ---------- 5 + 6. Update the summary and the "No books found" message ---------- */

function updateSummary() {
  var total = 0;
  var available = 0;
  var borrowed = 0;

  // count only the cards that are visible
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

  // show the message when no card is visible
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

  // change the badge (the CSS changes its colour and the ribbon)
  status.className = "status borrowed";
  status.textContent = "Borrowed";

  // change the button
  button.textContent = "Not Available";
  button.disabled = true;

  // if "available only" is ticked, this book must disappear now
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

  // show every card again
  for (var i = 1; i <= totalBooks; i++) {
    document.getElementById("book" + i).style.display = "";
  }

  updateSummary();
}
