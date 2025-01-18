import React, { useState, useEffect } from "react";

const Transactions: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]); // Full fetched data
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]); // Filtered transactions
  const [availableMonths, setAvailableMonths] = useState<string[]>([]); // Available months
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Selected month
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Selected category

  const capitalize = (str: string): string =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/expenditure/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();

        setTransactionsData(data); // Save fetched data

        // Extract unique months from the response
        const months = data.map((item: any) => item.month);
        setAvailableMonths(months); // Set unique months
        setSelectedMonth(months[0]); // Set default month to the first available
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions whenever `selectedMonth` or `selectedCategory` changes
  useEffect(() => {
    if (!selectedMonth) return;

    const monthData = transactionsData.find(
      (item: any) => item.month === selectedMonth
    );

    if (monthData) {
      const flattenedTransactions = monthData.allocation.flatMap(
        (allocation: any) =>
          allocation.transactions.map((transaction: any) => ({
            ...transaction,
            category: allocation.category, // Add category to each transaction
          }))
      );

      const filtered =
        selectedCategory === "all"
          ? flattenedTransactions
          : flattenedTransactions.filter(
              (transaction: any) => transaction.category === selectedCategory
            );

      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions([]);
    }
  }, [selectedMonth, selectedCategory, transactionsData]);

  // Handle deleting a transaction
  const handleDelete = async (transactionId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/expenditure/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      // Re-fetch data to update the UI
      const updatedData = await response.json();
      setTransactionsData(updatedData);

      // Refetch filtered data
      const monthData = updatedData.find(
        (item: any) => item.month === selectedMonth
      );
      const flattenedTransactions = monthData
        ? monthData.allocation.flatMap((allocation: any) =>
            allocation.transactions.map((transaction: any) => ({
              ...transaction,
              category: allocation.category,
            }))
          )
        : [];
      setFilteredTransactions(flattenedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
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
        {/* Month Filter */}
        <div>
          <label>
            Filter by Month:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Category Filter */}
        <div>
          <label>
            Filter by Category:
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              {filteredTransactions.map((transaction: any, index: number) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      color: "black",
                    }}
                  >
                    {capitalize(transaction.category)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      color: "black",
                    }}
                  >
                    {transaction.description}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      color: "black",
                    }}
                  >
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      color: "black",
                    }}
                  >
                    {transaction.dateLogged}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(transaction._id)}
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
            No transactions found for the selected month and category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
