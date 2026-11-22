// Book list page: show, search, filter, issue/return, delete
const tbody = document.getElementById("bookBody");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");
const emptyMsg = document.getElementById("empty");

function render() {
  const books = getBooks();
  const q = searchInput.value.trim().toLowerCase();
  const st = statusFilter.value;

  const shown = books.filter(b =>
    (b.title + " " + b.author + " " + b.category + " " + b.isbn).toLowerCase().includes(q) &&
    (st === "All" || b.status === st)
  );

  tbody.innerHTML = shown.map(b => `
    <tr>
      <td>${esc(b.title)}</td>
      <td>${esc(b.author)}</td>
      <td>${esc(b.category)}</td>
      <td><span class="badge ${b.status}">${b.status}</span></td>
      <td class="actions">
        <button class="btn small" onclick="toggleStatus(${b.id})">${b.status === "Available" ? "Issue" : "Return"}</button>
        <a class="btn small ghost" href="add-book.html?id=${b.id}">Edit</a>
        <button class="btn small danger" onclick="removeBook(${b.id})">Delete</button>
      </td>
    </tr>`).join("");

  emptyMsg.hidden = shown.length > 0;
  document.getElementById("total").textContent = books.length;
  document.getElementById("avail").textContent = books.filter(b => b.status === "Available").length;
  document.getElementById("issued").textContent = books.filter(b => b.status === "Issued").length;
}

function toggleStatus(id) {
  const books = getBooks();
  const b = books.find(x => x.id === id);
  b.status = b.status === "Available" ? "Issued" : "Available";
  saveBooks(books);
  render();
}

function removeBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  saveBooks(getBooks().filter(b => b.id !== id));
  render();
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);
render();