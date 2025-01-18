import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

interface FormModalProps {
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ onClose }) => {
  const context = useContext(UserContext);
  const [ageRange, setAgeRange] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [targetNetWorth, setTargetNetWorth] = useState("");
  const [targetSavings, setTargetSavings] = useState("");

  if (!context) {
    throw new Error("FormModal must be used within a UserProvider");
  }

  const { addSubmission } = context;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submission = {
      ageRange,
      monthlyIncome: parseFloat(monthlyIncome),
      targetNetWorth: parseFloat(targetNetWorth),
      targetSavings: parseFloat(targetSavings),
      date: new Date().toLocaleString(),
    };
    addSubmission(submission);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "#FFF", padding: "20px", borderRadius: "8px" }}>
        <h2>Enter Your Budget Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Age Range:
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              required
            >
              <option value="">Select Age Range</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56+">56+</option>
            </select>
          </label>
          <br />
          <label>
            Monthly Income:
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Target Net Worth:
            <input
              type="number"
              value={targetNetWorth}
              onChange={(e) => setTargetNetWorth(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Targeted Monthly Savings:
            <input
              type="number"
              value={targetSavings}
              onChange={(e) => setTargetSavings(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit</button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
