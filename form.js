// Add / Edit book form
const form = document.getElementById("bookForm");
const editId = Number(new URLSearchParams(location.search).get("id")) || null;

if (editId) {
  const book = getBooks().find(b => b.id === editId);
  if (book) {
    document.getElementById("formTitle").textContent = "Edit book";
    document.getElementById("saveBtn").textContent = "Update book";
    form.title.value = book.title;
    form.author.value = book.author;
    form.category.value = book.category;
    form.isbn.value = book.isbn;
    form.status.value = book.status;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = form.title.value.trim();
  const author = form.author.value.trim();
  document.getElementById("titleErr").textContent = title ? "" : "Book er name dewa dorkar.";
  document.getElementById("authorErr").textContent = author ? "" : "Author er name dewa dorkar.";
  if (!title || !author) return;

  const books = getBooks();
  const data = { title, author, category: form.category.value, isbn: form.isbn.value.trim(), status: form.status.value };

  if (editId) {
    const i = books.findIndex(b => b.id === editId);
    books[i] = { ...books[i], ...data };
  } else {
    books.push({ id: nextId(books), ...data });
  }
  saveBooks(books);
  location.href = "index.html";
});