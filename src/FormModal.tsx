import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

interface FormModalProps {
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ onClose }) => {
  const context = useContext(UserContext);
  const [ageRange, setAgeRange] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [month, setMonth] = useState("");
  const [targetSavings, setTargetSavings] = useState("");

  if (!context) {
    throw new Error("FormModal must be used within a UserProvider");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submission = {
      ageGroup: ageRange,
      incomeHistory: {
        month: parseFloat(month),
        monthlyIncome: parseFloat(monthlyIncome),
      },
      targetSavings: parseFloat(targetSavings),
    };

    try {
      const response = await fetch(
        "http://localhost:5001/api/user/update-income",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        }
      );

      if (!response.ok) throw new Error("Failed to update user data");

      const data = await response.json();
      console.log("User data updated successfully:", data);
      onClose();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
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
            color: "#990011",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ color: "#333", fontWeight: "bold" }}>
              Age Range:
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
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
              flexDirection: "row",
              gap: "10px",
            }}
          >
            <div
              style={{ flex: "1", display: "flex", flexDirection: "column" }}
            >
              <label style={{ color: "#333", fontWeight: "bold" }}>
                Month:
              </label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div
              style={{ flex: "1", display: "flex", flexDirection: "column" }}
            >
              <label style={{ color: "#333", fontWeight: "bold" }}>
                Monthly Salary:
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ color: "#333", fontWeight: "bold" }}>
              Target Savings:
            </label>
            <input
              type="number"
              value={targetSavings}
              onChange={(e) => setTargetSavings(e.target.value)}
              required
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
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
