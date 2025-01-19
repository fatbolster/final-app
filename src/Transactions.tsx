import React, { useState, useEffect } from "react";

const Transactions: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const capitalize = (str: string): string =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

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

        setTransactionsData(data);

        const months = data.map((item: any) => item.month);
        setAvailableMonths(months);
        setSelectedMonth(months[0]);
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
            category: allocation.category,
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

  const handleDelete = async (transactionId: string) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/expenditure/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      const updatedData = await response.json();
      console.log("Transaction deleted successfully:", updatedData);

      setTransactionsData((prevData) => {
        return prevData.map((item) => {
          if (item.month === selectedMonth) {
            const updatedAllocation = item.allocation.map((allocation) => ({
              ...allocation,
              transactions: allocation.transactions.filter(
                (transaction) => transaction._id !== transactionId
              ),
            }));
            return { ...item, allocation: updatedAllocation };
          }
          return item;
        });
      });

      setFilteredTransactions((prevFiltered) =>
        prevFiltered.filter((transaction) => transaction._id !== transactionId)
      );
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
        width: "100vw",
        boxSizing: "border-box",
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
          <label
            style={{
              color: "#4F4F4F",
              fontWeight: "bold",
            }}
          >
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
          <label
            style={{
              color: "#4F4F4F",
              fontWeight: "bold",
            }}
          >
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
          overflowX: "auto",
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
