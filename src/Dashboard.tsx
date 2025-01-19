import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import RingChart from "./RingChart";
import { useMonthContext } from "./MouthContext";

const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);
  const { selectedMonth, setSelectedMonth } = useMonthContext();
  const navigate = useNavigate();

  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [expenditureData, setExpenditureData] = useState<any[]>([]);
  const [incomeHistory, setIncomeHistory] = useState<any[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<any | null>(null);
  const [totalExpenditure, setTotalExpenditure] = useState<number>(0);
  const [targetSavings, setTargetSavings] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  if (!userContext) {
    throw new Error("Dashboard must be used within a UserProvider");
  }

  // Fetch user data including `incomeHistory`
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user/retrieve");
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        console.log("Fetched User Details:", data);

        setTargetSavings(data.targetSavings || 0);
        setIncomeHistory(data.incomeHistory || []);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

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

        const months = [...new Set(data.map((item: any) => item.month))];
        setAvailableMonths(months);
        setExpenditureData(data);

        if (months.length > 0 && !selectedMonth) {
          setSelectedMonth(months[0]);
        }
      } catch (error) {
        console.error("Error fetching expenditure data:", error);
      }
    };

    fetchExpenditures();
  }, [selectedMonth, setSelectedMonth]);

  // Calculate totals across all logs
  useEffect(() => {
    // Total income
    const totalIncomeSum = incomeHistory.reduce(
      (sum: number, income: any) => sum + (income.monthlyIncome || 0),
      0
    );
    setTotalIncome(totalIncomeSum);
    console.log("Total Income Across All Logs:", totalIncomeSum);

    // Total expenditure
    const totals: any = {
      food: 0,
      lifestyle: 0,
      shopping: 0,
      entertainment: 0,
    };
    let totalExpenditureSum = 0;

    expenditureData.forEach((expenditure: any) => {
      if (expenditure.allocation) {
        expenditure.allocation.forEach((category: any) => {
          if (category.transactions) {
            category.transactions.forEach((transaction: any) => {
              totals[category.category.toLowerCase()] +=
                transaction.amount || 0;
              totalExpenditureSum += transaction.amount || 0;
            });
          }
        });
      }
    });

    setCategoryTotals(totals);
    setTotalExpenditure(totalExpenditureSum);
    console.log("Total Expenditure Across All Logs:", totalExpenditureSum);
  }, [incomeHistory, expenditureData]);
  // Correct calculation for remaining budget
  const remainingBudget = totalIncome - totalExpenditure;

  // Calculate progress toward savings goal
  const progress =
    targetSavings > 0
      ? Math.min((remainingBudget / targetSavings) * 100, 100)
      : 0;

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

      {/* Progress Bar */}
      <div style={{ marginTop: "20px" }}>
        <h3>Progress Towards Targeted Savings</h3>
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
        <p
          style={{
            color: remainingBudget < 0 ? "red" : "inherit", // Highlight negative budget
          }}
        >
          Remaining Budget: ${remainingBudget.toFixed(2)} <br />
          Targeted Savings: ${targetSavings.toFixed(2)}
        </p>
      </div>

      {/* Grow Savings Button */}
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
