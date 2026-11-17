import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/api";

function Books() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [books, setBooks] = useState([]);
  const [editingBookId, setEditingBookId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingBookId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title || !author || !genre || !isbn || quantity === "") {
      alert("Please fill in all fields.");
      return;
    }

    const book = {
      title,
      author,
      genre,
      isbn,
      quantity: Number(quantity),
    };

    try {
      if (editingBookId !== null) {
        await updateBook(editingBookId, book);
        alert("Book updated successfully!");
      } else {
        await addBook(book);
        alert("Book added successfully!");
      }

      clearForm();
      await loadBooks();
    } catch (error) {
      alert(error.message || "Something went wrong.");
    }
  }

  function handleEdit(book) {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(String(book.quantity));
  }

  async function handleDelete(bookId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      await deleteBook(bookId);
      alert("Book deleted successfully!");
      await loadBooks();
    } catch (error) {
      alert(error.message || "Could not delete this book.");
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="books-page">
          <h1>Book Management</h1>

          <form className="book-form" onSubmit={handleSubmit}>
            <h2>
              {editingBookId !== null ? "Edit Book" : "Add New Book"}
            </h2>

            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />

            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />

            <input
              type="number"
              min="0"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button type="submit">
              {editingBookId !== null ? "Update Book" : "Add Book"}
            </button>

            {editingBookId !== null && (
              <button type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </form>

          <div className="book-list">
            <h2>Available Books</h2>

            {loading ? (
              <p>Loading books...</p>
            ) : books.length === 0 ? (
              <p>No books found. Add your first book.</p>
            ) : (
              books.map((book) => (
                <div className="book-item" key={book.id}>
                  <h3>{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Genre: {book.genre}</p>
                  <p>ISBN: {book.isbn}</p>
                  <p>Quantity: {book.quantity}</p>

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Books;