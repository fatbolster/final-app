import React, { useContext, useState, useEffect } from "react";
import { ExpenditureContext } from "./ExpenditureContext";
import { UserContext } from "./UserContext";
import { useMonthContext } from "./MouthContext";

const AlertComponent: React.FC = () => {
  const { selectedMonth } = useMonthContext(); // Get selected month
  const userContext = useContext(UserContext);
  const [expenditureData, setExpenditureData] = useState<any[]>([]);
  const [totalExpenditure, setTotalExpenditure] = useState<number>(0); // State for total expenditure
  const [aiMessage, setAiMessage] = useState<string>("Loading AI analysis...");
  const [error, setError] = useState<string | null>(null);

  if (!userContext) {
    throw new Error("AlertComponent must be used within UserProvider");
  }

  const { submissions } = userContext;

  // Fetch expenditure data on component mount
  useEffect(() => {
    const fetchExpenditureData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/expenditure/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expenditure data");
        }
        const data = await response.json();
        setExpenditureData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
    };

    fetchExpenditureData();
  }, []);

  // Calculate total expenditure based on the selected month
  useEffect(() => {
    if (selectedMonth && expenditureData.length > 0) {
      const filteredData = expenditureData.find(
        (item) => item.month === selectedMonth
      );

      if (filteredData) {
        // Sum up all transactions for the selected month
        const total = filteredData.allocation.reduce(
          (sum: number, allocation: any) => {
            const allocationTotal = allocation.transactions.reduce(
              (allocSum: number, transaction: any) =>
                allocSum + transaction.amount,
              0
            );
            return sum + allocationTotal;
          },
          0
        );

        setTotalExpenditure(total); // Update state with total expenditure
      } else {
        setTotalExpenditure(0); // If no data for the selected month
      }
    }
  }, [selectedMonth, expenditureData]);

  const latestSubmission = submissions[submissions.length - 1];
  if (!latestSubmission) {
    return null; // No data to display
  }

  const monthlyBudget = latestSubmission.targetSavings;

  // Fetch AI analysis based on the selected month
  useEffect(() => {
    const fetchAIAnalysis = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/machine/analyze?month=${selectedMonth}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch AI analysis. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setAiMessage(data.analysis); // Update the state with the AI's response
      } catch (err) {
        console.error("Error fetching AI analysis:", err);
        setError("Failed to load AI analysis. Please try again later.");
      }
    };

    if (selectedMonth) {
      fetchAIAnalysis();
    }
  }, [selectedMonth]);

  // Calculate daily budget and allowed spending
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const totalDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const dailyBudget = monthlyBudget / totalDaysInMonth;
  const allowedSpending = dailyBudget * currentDay;
  const exceedsThreshold = totalExpenditure > allowedSpending;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        margin: "20px 0",
      }}
    >
      {/* Single Alert Block */}
      <div
        style={{
          padding: "10px",
          border: "1px solid red",
          marginBottom: "10px",
          backgroundColor: "#FFE4E1",
          color: "#990000",
          borderRadius: "5px",
        }}
      >
        {exceedsThreshold ? (
          <p>
            ⚠️ Alert: You have exceeded your budgeted spending for the month so
            far! <br />
            <strong>Allowed Spending:</strong> ${allowedSpending.toFixed(2)}{" "}
            <br />
            <strong>Total Expenditure:</strong> ${totalExpenditure.toFixed(2)}
          </p>
        ) : (
          <p>
            ✅ Your spending is within the budget for the month so far! <br />
            <strong>Allowed Spending:</strong> ${allowedSpending.toFixed(2)}{" "}
            <br />
            <strong>Total Expenditure:</strong> ${totalExpenditure.toFixed(2)}
          </p>
        )}
      </div>

      {/* AI-Generated Insights */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#F9F9F9",
          height: "500px",
          overflowY: "auto",
        }}
      >
        <h4
          style={{ margin: "0 0 10px 0", color: "#4F4F4F", fontSize: "20px" }}
        >
          AI-Generated Insights (changes dynamically based on month selected)
        </h4>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p style={{ whiteSpace: "pre-wrap", color: "#4F4F4F" }}>
            {aiMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default AlertComponent;
