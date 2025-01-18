import React, { useContext, useState, useEffect } from "react";
import { ExpenditureContext } from "./ExpenditureContext";
import { UserContext } from "./UserContext";
import { useMonthContext } from "./MouthContext";

const AlertComponent: React.FC = () => {
  const { selectedMonth } = useMonthContext();
  const expenditureContext = useContext(ExpenditureContext);
  const userContext = useContext(UserContext);

  const [aiMessage, setAiMessage] = useState<string>("Loading AI analysis...");
  const [error, setError] = useState<string | null>(null);

  if (!expenditureContext || !userContext) {
    throw new Error(
      "AlertComponent must be used within both ExpenditureProvider and UserProvider"
    );
  }

  const { getTotalExpenditure } = expenditureContext;
  const { submissions } = userContext;

  const latestSubmission = submissions[submissions.length - 1];
  if (!latestSubmission) {
    return null; // No data to display
  }

  const totalExpenditure = getTotalExpenditure();
  const monthlyBudget = latestSubmission.targetSavings;

  useEffect(() => {
    const fetchAIAnalysis = async () => {
      try {
        console.log(`Fetching AI analysis for month: ${selectedMonth}`); // Debugging log
        const response = await fetch(
          `http://localhost:5001/api/machine/analyze?month=${selectedMonth}`,
          {
            method: "POST", // Ensure the method is POST
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
        console.log("AI Analysis Response:", data); // Log the response for debugging
        setAiMessage(data.analysis); // Update the state with the AI's response
      } catch (err) {
        console.error("Error fetching AI analysis:", err); // Log the error for debugging
        setError("Failed to load AI analysis. Please try again later.");
      }
    };

    if (selectedMonth) {
      fetchAIAnalysis();
    }
  }, [selectedMonth]);

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
        height: "100%", // Full height of the parent container
        margin: "20px 0",
      }}
    >
      {/* Scrollable container */}
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

      {/* Placeholder Box for AI-Generated Messages */}
      <div
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "#F9F9F9",
        }}
      >
        {/* Alert Box */}
        <div
          style={{
            padding: "10px",
            border: "1px solid red",
            marginBottom: "10px",
            backgroundColor: "#FFE4E1",
          }}
        >
          {exceedsThreshold ? (
            <p>
              ⚠️ Alert: You have exceeded your budgeted spending for the month
              so far! <br />
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
            backgroundColor: "#FFFFFF",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>AI-Generated Insights</h4>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <p style={{ whiteSpace: "pre-wrap" }}>{aiMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
