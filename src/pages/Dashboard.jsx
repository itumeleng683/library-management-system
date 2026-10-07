import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {

    const savedBooks = localStorage.getItem("books");
    const savedUsers = localStorage.getItem("users");

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

  }, []);


  const totalBooks = books.length;

  const availableBooks = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const lowStock = books.filter(
    (book) => Number(book.quantity) < 2
  ).length;


  return (

    <div className="dashboard">

      <Sidebar />


      <main className="main-content">

        <div className="dashboard-header">

          <div>
            <h1>Library Dashboard</h1>

            <p>
              Welcome to the Community Library Management System
            </p>
          </div>

          <Link
            to="/books"
            className="add-book-btn"
          >
            + Add Book
          </Link>

        </div>


        {/* Statistics */}

        <div className="stats">

          <div className="stat-card">

            <div className="stat-icon">
              
            </div>

            <div>
              <h3>Total Books</h3>
              <p>{totalBooks}</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              
            </div>

            <div>
              <h3>Available Books</h3>
              <p>{availableBooks}</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              
            </div>

            <div>
              <h3>Members</h3>
              <p>{users.length}</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              
            </div>

            <div>
              <h3>Low Stock</h3>
              <p>{lowStock}</p>
            </div>

          </div>

        </div>


        {/* Book Availability */}

        <div className="availability">

          <div className="section-header">

            <div>
              <h2>Book Availability</h2>

              <p>
                Current books and available quantities
              </p>
            </div>

          </div>


          {books.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                
              </div>

              <h3>No books yet</h3>

              <p>
                Add your first book to the library.
              </p>

              <Link
                to="/books"
                className="add-book-btn"
              >
                + Add Book
              </Link>

            </div>

          ) : (

            <div className="book-grid">

              {books.map((book, index) => {

                const isLowStock =
                  Number(book.quantity) < 2;

                return (

                  <div
                    className={
                      isLowStock
                        ? "book-item low-stock-item"
                        : "book-item"
                    }
                    key={index}
                  >

                    <div className="book-top">

                      <h3>{book.title}</h3>

                      {isLowStock && (
                        <span className="stock-warning">
                          Low Stock
                        </span>
                      )}

                    </div>


                    <p>
                      <strong>Author:</strong>{" "}
                      {book.author}
                    </p>

                    <p>
                      <strong>Genre:</strong>{" "}
                      {book.genre}
                    </p>

                    <p>
                      <strong>ISBN:</strong>{" "}
                      {book.isbn}
                    </p>


                    <div className="quantity">

                      <span>
                        Available
                      </span>

                      <strong>
                        {book.quantity}
                      </strong>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

        </div>

      </main>

    </div>

  );
}

export default Dashboard;