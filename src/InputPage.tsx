import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ExpenditureContext } from "./ExpenditureContext";

const InputPage: React.FC = () => {
  const [sector, setSector] = useState<
    "food" | "lifestyle" | "shopping" | "entertainment"
  >("food");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const context = useContext(ExpenditureContext);

  if (!context) {
    throw new Error("InputPage must be used within an ExpenditureProvider");
  }

  const { addExpenditure } = context;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount) && parsedAmount > 0 && description.trim()) {
      addExpenditure(sector, parsedAmount);
      setAmount("");
      setDescription("");
      alert("Transaction added!");
    } else {
      alert("Please fill in all fields with valid data.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height to vertically center
        width: "100vw", // Full width for horizontal centering
        background: "#FCF6F5", // Matches your theme
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#FFFFFF",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a modern look
          maxWidth: "500px", // Limit the width of the form
          width: "90%", // Make it responsive
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#990011" }}>
          Add Expenditure
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label>
              Sector:
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as typeof sector)}
                style={{
                  display: "block",
                  width: "100%", // Full width for consistency
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              >
                <option value="food">Food</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>
              Amount:
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter transaction description"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </label>
          </div>

          <button
            type="submit"
            style={{
              background: "#990011",
              color: "#FCF6F5",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              width: "100%", // Full width button
            }}
          >
            Add Transaction
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link to="/">
            <button
              style={{
                background: "#FCF6F5",
                color: "#990011",
                border: "1px solid #990011",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%", // Full width button
              }}
            >
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InputPage;
