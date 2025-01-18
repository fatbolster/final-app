import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import RingChart from "./RingChart";

const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const [availableMonths, setAvailableMonths] = useState<string[]>([]); // Dynamically fetched months
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Selected month
  const [expenditureData, setExpenditureData] = useState<any[]>([]); // Store raw expenditure data
  const [categoryTotals, setCategoryTotals] = useState<any | null>(null); // Sum totals for each category
  const [totalExpenditure, setTotalExpenditure] = useState<number>(0); // Total expenditure for selected month

  if (!userContext) {
    throw new Error("Dashboard must be used within a UserProvider");
  }

  const { submissions } = userContext;

  const latestSubmission = submissions[submissions.length - 1];
  if (!latestSubmission) {
    return <p>No data available. Please submit your details.</p>;
  }

  // Fetch expenditure data and extract unique months
  useEffect(() => {
    const fetchExpenditures = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/expenditure/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expenditure data");
        }
        const data = await response.json();

        console.log("Fetched Expenditure Data:", data);

        // Extract unique months from the response
        const months = [...new Set(data.map((item: any) => item.month))];
        setAvailableMonths(months);

        // Set default selected month to the first available month
        if (months.length > 0) {
          setSelectedMonth(months[0]);
        }

        setExpenditureData(data); // Store raw expenditure data for further processing
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
    };

    fetchExpenditures();
  }, []);

  // Compute category totals and total expenditure based on the selected month
  useEffect(() => {
    if (!selectedMonth || expenditureData.length === 0) {
      setCategoryTotals(null); // Reset categoryTotals if no month is selected or no data
      setTotalExpenditure(0);
      return;
    }

    const totals: any = {
      food: 0,
      lifestyle: 0,
      shopping: 0,
      entertainment: 0,
    };

    // Filter expenditures for the selected month and compute totals
    expenditureData
      .filter((expenditure: any) => expenditure.month === selectedMonth)
      .forEach((expenditure: any) => {
        expenditure.allocation.forEach((category: any) => {
          if (totals[category.category.toLowerCase()] !== undefined) {
            category.transactions.forEach((transaction: any) => {
              totals[category.category.toLowerCase()] += transaction.amount;
            });
          }
        });
      });

    console.log("Updated Category Totals for Selected Month:", totals);

    setCategoryTotals(totals);

    // Compute total expenditure dynamically
    const total = Object.values(totals).reduce(
      (acc: number, value: number) => acc + value,
      0
    );
    setTotalExpenditure(total);
  }, [selectedMonth, expenditureData]);

  const remainingBudget =
    latestSubmission.monthlyIncome - (totalExpenditure || 0);
  const progress = Math.min(
    (remainingBudget / latestSubmission.targetNetWorth) * 100,
    100
  );

  return (
    <div>
      <h2>Monthly Expenditure Breakdown</h2>

      {/* Month Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Select Month:
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
      </div>

      {categoryTotals && (
        <RingChart data={categoryTotals} total={totalExpenditure} />
      )}

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
