import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { ExpenditureContext } from "./ExpenditureContext";

const FixedDeposits: React.FC = () => {
  const expenditureContext = useContext(ExpenditureContext);
  const userContext = useContext(UserContext);

  if (!expenditureContext || !userContext) {
    throw new Error(
      "FixedDeposits must be used within both ExpenditureProvider and UserProvider"
    );
  }

  const { getTotalExpenditure } = expenditureContext;
  const { submissions } = userContext;

  const latestSubmission = submissions[submissions.length - 1];
  const totalExpenditure = getTotalExpenditure();
  const remainingBudget = latestSubmission.monthlyIncome - totalExpenditure;

  // Simulated scraped data for fixed deposits
  const fixedDeposits = [
    { bank: "Bank A", tenure: "6 months", minAmount: 500, rate: 3.5 },
    { bank: "Bank B", tenure: "6 months", minAmount: 1000, rate: 3.8 },
    { bank: "Bank C", tenure: "12 months", minAmount: 2000, rate: 4.0 },
    { bank: "Bank D", tenure: "12 months", minAmount: 1500, rate: 4.2 },
    { bank: "Bank E", tenure: "24 months", minAmount: 2500, rate: 4.5 },
    { bank: "Bank F", tenure: "36 months", minAmount: 3000, rate: 5.0 },
  ];

  const [selectedTenure, setSelectedTenure] = useState<string>("all");
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);

  const filteredDeposits = fixedDeposits
    .filter((deposit) => {
      if (selectedTenure !== "all" && deposit.tenure !== selectedTenure) {
        return false;
      }
      if (deposit.minAmount < minAmountFilter) {
        return false;
      }
      return deposit.minAmount <= remainingBudget;
    })
    .sort((a, b) => b.rate - a.rate);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        background: "#FCF6F5",
        boxSizing: "border-box", // Ensure padding doesn't affect size
        padding: "20px",
      }}
    >
      {/* Centered Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#990011" }}>
          Best Fixed Deposit Rates for Your Budget
        </h2>
        <p>Remaining Budget: ${remainingBudget.toFixed(2)}</p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
          width: "100%", // Full width for filters
          maxWidth: "1200px", // Restrict maximum width
        }}
      >
        <div>
          <label>
            Filter by Tenure:
            <select
              value={selectedTenure}
              onChange={(e) => setSelectedTenure(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            >
              <option value="all">All</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
              <option value="24 months">24 months</option>
              <option value="36 months">36 months</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Minimum Amount:
            <input
              type="number"
              value={minAmountFilter}
              onChange={(e) => setMinAmountFilter(Number(e.target.value))}
              placeholder="Enter amount"
              style={{
                marginLeft: "10px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "150px",
              }}
            />
          </label>
        </div>
      </div>

      {/* Table */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        {filteredDeposits.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#FFFFFF",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ background: "#990011", color: "#FCF6F5" }}>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Bank
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Tenure
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Minimum Amount
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Interest Rate (%)
                </th>
                <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                  Potential Earnings
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((deposit, index) => {
                const investedAmount = Math.min(
                  remainingBudget,
                  deposit.minAmount
                );
                const earnings =
                  (investedAmount * deposit.rate * parseInt(deposit.tenure)) /
                  (100 * 12);

                return (
                  <tr key={index}>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      {deposit.bank}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      {deposit.tenure}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      ${deposit.minAmount}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      {deposit.rate}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                      ${earnings.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>
            No fixed deposit options available within your budget and filter
            criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default FixedDeposits;
