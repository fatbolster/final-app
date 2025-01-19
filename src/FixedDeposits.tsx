import React, { useContext, useState, useEffect } from "react";
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

  const [fixedDeposits, setFixedDeposits] = useState<any[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number>(5000);

  useEffect(() => {
    const fetchRemainingBudget = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/bank/expense");
        if (!response.ok) {
          throw new Error("Failed to fetch current savings");
        }
        const data = await response.json();
        setRemainingBudget(data.currentSavings);
      } catch (error) {
        console.error("Error fetching current savings:", error);
      }
    };

    fetchRemainingBudget();
  }, []);

  useEffect(() => {
    const fetchFixedDeposits = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/bank/fixed-deposit-rates"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fixed deposit rates");
        }
        const data = await response.json();

        const filteredData = data.rates.filter(
          (bank: any) => bank.bankName !== "RHB"
        );

        setFixedDeposits(filteredData);
      } catch (error) {
        console.error("Error fetching fixed deposit rates:", error);
      }
    };

    fetchFixedDeposits();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        background: "#FCF6F5",
        boxSizing: "border-box",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#990011" }}>
          Best Fixed Deposit Rates for Your Budget
        </h2>
        <p>Remaining Budget: ${remainingBudget.toFixed(2)}</p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          maxHeight: "500px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          background: "#FFFFFF",
        }}
      >
        {fixedDeposits.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
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
              {fixedDeposits.map((bank, bankIndex) => (
                <React.Fragment key={bankIndex}>
                  {bank.offers.map((offer, offerIndex) => {
                    const principal = remainingBudget;
                    const tenureYears = parseFloat(offer.tenure);
                    const interestRate = parseFloat(offer.interestRate);

                    const potentialEarnings =
                      principal * tenureYears * (interestRate / 100);

                    return (
                      <tr
                        key={offerIndex}
                        style={{
                          color: "#000",
                          backgroundColor:
                            (bankIndex + offerIndex) % 2 === 0
                              ? "#F9F9F9"
                              : "#FFF",
                        }}
                      >
                        {offerIndex === 0 && (
                          <td
                            rowSpan={bank.offers.length}
                            style={{
                              background: "#990011",
                              color: "white",
                              fontWeight: "bold",
                              textAlign: "center",
                              verticalAlign: "middle",
                              border: "1px solid #ccc",
                            }}
                          >
                            {bank.bankName}
                          </td>
                        )}
                        <td
                          style={{ padding: "10px", border: "1px solid #ccc" }}
                        >
                          {offer.tenure}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ccc" }}
                        >
                          {offer.minAmount}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ccc" }}
                        >
                          {offer.interestRate}
                        </td>
                        <td
                          style={{ padding: "10px", border: "1px solid #ccc" }}
                        >
                          ${potentialEarnings.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p
            style={{
              textAlign: "center",
              padding: "10px",
              color: "#990011",
            }}
          >
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default FixedDeposits;
