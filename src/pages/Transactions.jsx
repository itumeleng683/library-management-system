import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Transactions() {

  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedBook, setSelectedBook] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("add");


  useEffect(() => {

    const savedBooks = localStorage.getItem("books");
    const savedTransactions = localStorage.getItem("transactions");

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

  }, []);


  function handleTransaction(e) {

    e.preventDefault();

    if (!selectedBook || !amount) {
      alert("Please select a book and enter a quantity.");
      return;
    }

    const quantity = Number(amount);

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }


    const bookIndex = books.findIndex(
      (book) => book.isbn === selectedBook
    );

    if (bookIndex === -1) {
      alert("Book not found.");
      return;
    }


    const updatedBooks = [...books];

    const book = updatedBooks[bookIndex];


    // Add stock
    if (type === "add") {

      book.quantity =
        Number(book.quantity) + quantity;

    }


    // Borrow book
    if (type === "borrow") {

      if (Number(book.quantity) < quantity) {

        alert("Not enough stock available.");
        return;

      }

      book.quantity =
        Number(book.quantity) - quantity;

    }


    // Save updated books
    setBooks(updatedBooks);

    localStorage.setItem(
      "books",
      JSON.stringify(updatedBooks)
    );


    // Create transaction record
    const newTransaction = {

      bookTitle: book.title,

      type:
        type === "add"
          ? "Stock Added"
          : "Borrowed",

      quantity: quantity,

      date: new Date().toLocaleString()

    };


    const updatedTransactions = [
      newTransaction,
      ...transactions
    ];


    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );


    alert("Transaction completed successfully!");


    setSelectedBook("");
    setAmount("");

  }


  return (

    <div className="dashboard">

      <Sidebar />

      <main className="main-content">

        <h1>Transactions</h1>

        <p>
          Add stock or record books borrowed from the library.
        </p>


        {/* Transaction Form */}

        <div className="book-form">

          <h2>Manage Stock</h2>


          <form onSubmit={handleTransaction}>

            <label>
              Select Book
            </label>

            <select
              value={selectedBook}
              onChange={(e) =>
                setSelectedBook(e.target.value)
              }
            >

              <option value="">
                Choose a book
              </option>

              {books.map((book, index) => (

                <option
                  key={index}
                  value={book.isbn}
                >
                  {book.title}
                </option>

              ))}

            </select>


            <label>
              Transaction Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >

              <option value="add">
                Add Stock
              </option>

              <option value="borrow">
                Borrow Book
              </option>

            </select>


            <label>
              Quantity
            </label>

            <input
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />


            <button type="submit">
              Complete Transaction
            </button>

          </form>

        </div>


        {/* Transaction History */}

        <div className="book-list">

          <h2>Transaction History</h2>


          {transactions.length === 0 ? (

            <p>
              No transactions have been recorded yet.
            </p>

          ) : (

            transactions.map((transaction, index) => (

              <div
                className="book-item"
                key={index}
              >

                <h3>
                  {transaction.bookTitle}
                </h3>

                <p>
                  Type: {transaction.type}
                </p>

                <p>
                  Quantity: {transaction.quantity}
                </p>

                <p>
                  Date: {transaction.date}
                </p>

              </div>

            ))

          )}

        </div>

      </main>

    </div>

  );

}

export default Transactions;