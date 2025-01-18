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
  const [currentSavings, setCurrentSavings] = useState("");

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
      targetSavings: parseFloat(currentSavings),
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
      <div
        style={{
          background: "#FFF",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
            color: "#990011", // Dark red for emphasis
          }}
        >
          Enter Your Budget Details
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                flex: "1",
                marginRight: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Age Range:
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              required
              style={{ flex: "2", padding: "5px" }}
            >
              <option value="">Select Age Range</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56+">56+</option>
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                flex: "1",
                marginRight: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Monthly Income:
            </label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
              style={{ flex: "2", padding: "5px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                flex: "1",
                marginRight: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Target Net Worth:
            </label>
            <input
              type="number"
              value={targetNetWorth}
              onChange={(e) => setTargetNetWorth(e.target.value)}
              required
              style={{ flex: "2", padding: "5px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label
              style={{
                flex: "1",
                marginRight: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Current Savings:
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              required
              style={{ flex: "2", padding: "5px" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                flex: "1",
                background: "#4CAF50",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: "1",
                background: "#FF5722",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
