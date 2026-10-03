import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("loggedIn", "true");

      setIsLoggedIn(true);

      navigate("/");
    } else {
      alert("Invalid username or password.");
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>📚 LibTrack</h1>

        <p>Community Library Management System</p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

        <small>
          Demo: admin / admin123
        </small>

      </div>

    </div>
  );
}

export default Login;