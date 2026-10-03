import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Books() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [books, setBooks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load books from localStorage
  useEffect(() => {
    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  // Add or update a book
  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields.");
      return;
    }

    const newBook = {
      title,
      author,
      genre,
      isbn,
      quantity: Number(quantity),
    };

    if (editingIndex !== null) {
      const updatedBooks = [...books];
      updatedBooks[editingIndex] = newBook;

      setBooks(updatedBooks);
      localStorage.setItem("books", JSON.stringify(updatedBooks));

      alert("Book updated successfully!");

      setEditingIndex(null);
    } else {
      const updatedBooks = [...books, newBook];

      setBooks(updatedBooks);
      localStorage.setItem("books", JSON.stringify(updatedBooks));

      alert("Book added successfully!");
    }

    clearForm();
  }

  // Clear the form
  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
  }

  // Edit a book
  function handleEdit(index) {
    const book = books[index];

    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);

    setEditingIndex(index);
  }

  // Delete a book
  function handleDelete(index) {
    const updatedBooks = books.filter((_, i) => i !== index);

    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }

  // Cancel editing
  function handleCancel() {
    clearForm();
    setEditingIndex(null);
  }

  return (
  <div className="dashboard">

    <Sidebar />

    <main className="main-content">

      <div className="books-page">
        </div>
        </main>

      <h1>Book Management</h1>
      <p>Add and manage books in the library.</p>

      {/* Book Form */}
      <div className="book-form">

        <h2>
          {editingIndex !== null ? "Edit Book" : "Add New Book"}
        </h2>

        <form onSubmit={handleSubmit}>

          <label>Title</label>
          <input
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Author</label>
          <input
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <label>Genre</label>
          <input
            type="text"
            placeholder="Enter genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <label>ISBN</label>
          <input
            type="text"
            placeholder="Enter ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />

          <label>Initial Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button type="submit">
            {editingIndex !== null ? "Update Book" : "Add Book"}
          </button>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* Books List */}
      <div className="book-list">

        <h2>Books in Library</h2>

        {books.length === 0 ? (
          <p>No books have been added yet.</p>
        ) : (
          books.map((book, index) => (
            <div className="book-item" key={index}>

              <h3>{book.title}</h3>

              <p>Author: {book.author}</p>
              <p>Genre: {book.genre}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Quantity: {book.quantity}</p>

              <button
                className="edit-btn"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Books;