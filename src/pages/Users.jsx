import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Users() {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("Member");

  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Add or update user
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !membershipId || !role) {
      alert("Please fill in all fields.");
      return;
    }

    const newUser = {
      name,
      membershipId,
      role,
    };

    if (editingIndex !== null) {
      const updatedUsers = [...users];

      updatedUsers[editingIndex] = newUser;

      setUsers(updatedUsers);

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      alert("User updated successfully!");

      setEditingIndex(null);
    } else {
      const updatedUsers = [...users, newUser];

      setUsers(updatedUsers);

      localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers)
      );

      alert("User added successfully!");
    }

    clearForm();
  }

  // Clear form
  function clearForm() {
    setName("");
    setMembershipId("");
    setRole("Member");
  }

  // Edit user
  function handleEdit(index) {
    const user = users[index];

    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);

    setEditingIndex(index);
  }

  // Delete user
  function handleDelete(index) {
    const updatedUsers = users.filter(
      (_, i) => i !== index
    );

    setUsers(updatedUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
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

        <h1>User Management</h1>

        <p>
          Add and manage library users.
        </p>

        {/* User Form */}
        <div className="book-form">

          <h2>
            {editingIndex !== null
              ? "Edit User"
              : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit}>

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter user's name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <label>Membership ID</label>

            <input
              type="text"
              placeholder="Enter membership ID"
              value={membershipId}
              onChange={(e) =>
                setMembershipId(e.target.value)
              }
            />

            <label>Role</label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="Member">Member</option>
              <option value="Librarian">Librarian</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">
              {editingIndex !== null
                ? "Update User"
                : "Add User"}
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

        {/* Users List */}
        <div className="book-list">

          <h2>Library Users</h2>

          {users.length === 0 ? (
            <p>No users have been added yet.</p>
          ) : (
            users.map((user, index) => (
              <div
                className="book-item"
                key={index}
              >

                <h3>{user.name}</h3>

                <p>
                  Membership ID: {user.membershipId}
                </p>

                <p>
                  Role: {user.role}
                </p>

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(index)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(index)
                  }
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </main>

    </div>
  );
}

export default Users;