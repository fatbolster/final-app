import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const Submissions: React.FC = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Submissions must be used within a UserProvider");
  }

  const { submissions } = context;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Previous Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {submissions.map((submission, index) => (
            <li key={index}>
              <strong>Date:</strong> {submission.date} <br />
              <strong>Age:</strong> {submission.ageRange} <br />
              <strong>Monthly Income:</strong> $
              {submission.monthlyIncome.toFixed(2)} <br />
              <strong>Target Net Worth:</strong> $
              {submission.targetNetWorth.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Submissions;
