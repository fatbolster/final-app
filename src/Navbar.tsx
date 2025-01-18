import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onOpenForm: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenForm }) => {
  const navItemStyle = {
    padding: "10px 20px",
    color: "#FCF6F5",
    textDecoration: "none",
    borderRadius: "5px",
    background: "#990011",
    cursor: "pointer",
    display: "inline-block",
  };

  const navContainerStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  return (
    <nav
      style={{
        position: "fixed", // Fix the navbar to the top
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000, // Ensure it stays above other elements
        margin: 0,
        padding: "10px",
        background: "#990011",
        color: "#FCF6F5",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Optional shadow for style
      }}
    >
      <div style={navContainerStyle}>
        <Link to="/" style={navItemStyle}>
          Dashboard
        </Link>
        <Link to="/input" style={navItemStyle}>
          Add Expenses
        </Link>
        <Link to="/transactions" style={navItemStyle}>
          Transactions
        </Link>
        <button
          onClick={onOpenForm}
          style={{
            ...navItemStyle,
            background: "#FCF6F5",
            color: "#990011",
            border: "1px solid #990011",
          }}
        >
          Goal Settings
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
