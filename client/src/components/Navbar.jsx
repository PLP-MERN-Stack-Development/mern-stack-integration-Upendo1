import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.25rem",
        backgroundColor: "#222",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>MERN Blog</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* Show navigation links only when logged in */}
        {user ? (
          <>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/create" style={{ color: "white", textDecoration: "none" }}>
              New Post
            </Link>
          </>
        ) : null}

        {/* Auth controls */}
        {!user ? (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        ) : (
          <>
            <span style={{ color: "#ddd" }}>Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
