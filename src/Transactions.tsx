import React, { useState, useContext } from "react";
import { ExpenditureContext } from "./ExpenditureContext";

const Transactions: React.FC = () => {
  const expenditureContext = useContext(ExpenditureContext);

  if (!expenditureContext) {
    throw new Error("Transactions must be used within an ExpenditureProvider");
  }

  const { expenditures } = expenditureContext;

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      sector: "food",
      description: "Lunch at Cafe",
      amount: 20,
      date: "2025-01-01",
    },
    {
      id: 2,
      sector: "shopping",
      description: "Bought a jacket",
      amount: 50,
      date: "2025-01-05",
    },
    {
      id: 3,
      sector: "entertainment",
      description: "Movie ticket",
      amount: 15,
      date: "2025-01-10",
    },
    {
      id: 4,
      sector: "lifestyle",
      description: "Yoga class",
      amount: 30,
      date: "2025-01-15",
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedSector, setSelectedSector] = useState<string>("all");

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleSectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSector(event.target.value);
  };

  // Handle deleting a transaction
  const handleDelete = (id: number) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionMonth = transaction.date.slice(0, 7);
    const matchesMonth = transactionMonth === selectedMonth;
    const matchesSector =
      selectedSector === "all" || transaction.sector === selectedSector;

    return matchesMonth && matchesSector;
  });

  // Helper function to capitalize the first letter of each word
  const capitalize = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#FCF6F5",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#990011" }}>Transactions</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>
            Filter by Month:
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Filter by Sector:
            <select
              value={selectedSector}
              onChange={handleSectorChange}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="all">All</option>
              <option value="food">Food</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </label>
        </div>
      </div>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#FFFFFF",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {filteredTransactions.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#990011", color: "#FCF6F5" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Category
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Description
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Amount
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Date
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {capitalize(transaction.sector)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {transaction.description}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {transaction.date}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      style={{
                        background: "#990011",
                        color: "#FCF6F5",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "#990011" }}>
            No transactions found for the selected month and sector.
          </p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
