import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenditureContext } from "./ExpenditureContext";
import { UserContext } from "./UserContext";
import RingChart from "./RingChart";

const Dashboard: React.FC = () => {
  const expenditureContext = useContext(ExpenditureContext);
  const userContext = useContext(UserContext);
  const navigate = useNavigate(); // React Router hook to navigate between pages

  if (!expenditureContext || !userContext) {
    throw new Error(
      "Dashboard must be used within both ExpenditureProvider and UserProvider"
    );
  }

  const { expenditures, getTotalExpenditure } = expenditureContext;
  const { submissions } = userContext;

  const latestSubmission = submissions[submissions.length - 1];
  if (!latestSubmission) {
    return <p>No data available. Please submit your details.</p>;
  }

  const totalExpenditure = getTotalExpenditure();
  const remainingBudget = latestSubmission.monthlyIncome - totalExpenditure;
  const progress = Math.min(
    (remainingBudget / latestSubmission.targetNetWorth) * 100,
    100
  );

  return (
    <div>
      <h2>Monthly Expenditure Breakdown</h2>
      <RingChart data={expenditures} />

      {/* Horizontal Progress Bar */}
      <div style={{ marginTop: "20px" }}>
        <h3>Progress Towards Targetted Savings</h3>
        <div
          style={{
            position: "relative",
            height: "30px",
            background: "#F0F0F0",
            borderRadius: "15px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: progress >= 100 ? "#4CAF50" : "#FF5722",
              height: "100%",
              borderRadius: "15px",
              transition: "width 0.3s ease",
            }}
          ></div>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              color: progress >= 100 ? "#FFFFFF" : "#000000",
            }}
          >
            {progress.toFixed(2)}%
          </span>
        </div>
        <p>
          Remaining Budget: ${remainingBudget.toFixed(2)} <br />
          Targetted Savings: ${latestSubmission.targetNetWorth.toFixed(2)}
        </p>
      </div>

      {/* New Button for Fixed Deposit Rates */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/fixed-deposits")}
          style={{
            background: "#990011",
            color: "#FCF6F5",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Grow your Savings
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
