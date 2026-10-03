import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  function handleLogout() {

    localStorage.removeItem("loggedIn");

    window.location.href = "/login";

  }

  return (

    <aside className="sidebar">

      <h2>📚 LibTrack</h2>

      <p>Community Library</p>


      <nav>

        <Link to="/">
          <button>Dashboard</button>
        </Link>

        <Link to="/books">
          <button>Books</button>
        </Link>

        <Link to="/transactions">
          <button>Transactions</button>
        </Link>

        <Link to="/users">
          <button>Users</button>
        </Link>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>

    </aside>

  );
}

export default Sidebar;