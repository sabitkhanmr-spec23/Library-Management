// localStorage e book data save/load korar common code
const KEY = "library_books";

const sampleBooks = [
  { id: 1, title: "Padma Nadir Majhi", author: "Manik Bandopadhyay", category: "Novel", isbn: "978-1", status: "Available" },
  { id: 2, title: "Pother Panchali", author: "Bibhutibhushan Bandyopadhyay", category: "Novel", isbn: "978-2", status: "Issued" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Technology", isbn: "978-3", status: "Available" }
];

function getBooks() {
  const data = localStorage.getItem(KEY);
  if (!data) { saveBooks(sampleBooks); return [...sampleBooks]; }
  return JSON.parse(data);
}

function saveBooks(books) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

function nextId(books) {
  return books.length ? Math.max(...books.map(b => b.id)) + 1 : 1;
}