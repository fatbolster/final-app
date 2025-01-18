import React, { useContext } from "react";
import { ExpenditureContext } from "./ExpenditureContext";
import { UserContext } from "./UserContext";

const AlertComponent: React.FC = () => {
  const expenditureContext = useContext(ExpenditureContext);
  const userContext = useContext(UserContext);

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

  const currentDate = new Date();
  const totalDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const elapsedDays = currentDate.getDate();
  const dailyBudget = monthlyBudget / totalDaysInMonth;
  const allowedSpending = dailyBudget * elapsedDays;

  const exceedsThreshold = totalExpenditure > allowedSpending;

  return (
    <div style={{ margin: "20px 0" }}>
      {/* Alert Box */}
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
          backgroundColor: "#F9F9F9",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>AI-Generated Insights</h4>
        <p style={{ color: "#888", fontStyle: "italic" }}>
          Placeholder: AI-generated messages will appear here to provide
          personalized insights about your spending.
        </p>
      </div>
    </div>
  );
};

export default AlertComponent;
