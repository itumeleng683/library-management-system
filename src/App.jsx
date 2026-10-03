import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/books"
          element={
            isLoggedIn ? (
              <Books />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/transactions"
          element={
            isLoggedIn ? (
              <Transactions />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/users"
          element={
            isLoggedIn ? (
              <Users />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;