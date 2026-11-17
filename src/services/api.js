const API_URL = "http://localhost:5000";

// Get all books
export const getBooks = async () => {
  const response = await fetch(API_URL + "/books");

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data.books;
};

// Add a book
export const addBook = async (book) => {
  const response = await fetch(API_URL + "/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add book");
  }

  return data;
};

// Update a book
export const updateBook = async (id, book) => {
  const response = await fetch(API_URL + "/books/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update book");
  }

  return data;
};

// Delete a book
export const deleteBook = async (id) => {
  const response = await fetch(API_URL + "/books/" + id, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete book");
  }

  return data;
};

// Get all users
export const getUsers = async () => {
  const response = await fetch(API_URL + "/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await response.json();
  return data.users;
};

// Get all transactions
export const getTransactions = async () => {
  const response = await fetch(API_URL + "/transactions");

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();
  return data.transactions;
};