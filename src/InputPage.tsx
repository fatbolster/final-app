import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ExpenditureContext } from "./ExpenditureContext";

const InputPage: React.FC = () => {
  const [sector, setSector] = useState<
    "food" | "lifestyle" | "shopping" | "entertainment"
  >("food");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [month, setMonth] = useState<string>("2025-01"); // Default month for the JSON object

  const context = useContext(ExpenditureContext);
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  if (!context) {
    throw new Error("InputPage must be used within an ExpenditureProvider");
  }

  const { addExpenditure } = context;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);

    if (
      !isNaN(parsedAmount) &&
      parsedAmount > 0 &&
      description.trim() &&
      date.trim()
    ) {
      // If `date` is a Date object, format it into YYYY-MM-DD
      const formattedDate =
        typeof date === "object" && date instanceof Date
          ? formatDateToYYYYMMDD(date)
          : date;

      // Derive the month from the inputted date
      const derivedMonth = formattedDate.slice(0, 7); // Extract 'YYYY-MM' from 'YYYY-MM-DD'

      // Build the JSON object as per the schema
      const jsonObject = {
        month: derivedMonth,
        allocation: [
          {
            category: sector,
            transactions: [
              {
                dateLogged: formattedDate, // Use the formatted date string
                amount: parsedAmount,
                description: description.trim(),
              },
            ],
          },
        ],
      };

      try {
        const response = await fetch(
          "http://localhost:5001/api/expenditure/update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonObject),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error from server:", errorData);
          alert(`Failed to update expenditure: ${errorData.message}`);
          return;
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        alert("Expenditure updated successfully!");

        setAmount("");
        setDescription("");
        setDate("");
      } catch (error) {
        console.error("Error sending data:", error);
        alert("An error occurred while sending data to the server.");
      }
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
        height: "100vh",
        width: "100vw",
        background: "#FCF6F5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#FFFFFF",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "90%",
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
                  width: "100%",
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

          <div style={{ marginBottom: "20px" }}>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value.split("T")[0])}
                placeholder="Enter date"
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
                width: "100%",
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
