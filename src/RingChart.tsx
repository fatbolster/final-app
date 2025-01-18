import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenditureState {
  food: number;
  entertainment: number;
  shopping: number;
  lifestyle: number;
}

interface RingChartProps {
  data: ExpenditureState;
}

const RingChart: React.FC<RingChartProps> = ({ data }) => {
  console.log("Data passed to RingChart:", data);

  // Safely handle cases where data might be missing or incomplete
  const numericData = {
    food: Number(data?.food || 0),
    entertainment: Number(data?.entertainment || 0),
    shopping: Number(data?.shopping || 0),
    lifestyle: Number(data?.lifestyle || 0),
  };

  console.log("Converted Numeric Data:", numericData);

  // Calculate total expenditure dynamically
  const totalExpenditure = Object.values(numericData).reduce(
    (acc, value) => acc + value,
    0
  );

  console.log("Total Expenditure in RingChart:", totalExpenditure);

  const chartData = {
    labels: ["Food", "Entertainment", "Shopping", "Lifestyle"],
    datasets: [
      {
        data: [
          numericData.food,
          numericData.entertainment,
          numericData.shopping,
          numericData.lifestyle,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#990011"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FCF6F5"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const category = tooltipItem.label;
            const value = tooltipItem.raw;
            const percentage = totalExpenditure
              ? ((value / totalExpenditure) * 100).toFixed(2)
              : "0.00";
            return `${category}: $${value} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: "bottom" as const, // Move legend to bottom
      },
    },
    maintainAspectRatio: false, // Prevent distortion
    cutout: "70%", // Create a larger "hole" in the middle for text
  };

  const plugins = [
    {
      id: "text-center",
      beforeDraw: (chart: any) => {
        const { ctx, chartArea } = chart;

        // Get chart dimensions
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        // Set font size and style
        ctx.save();
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.restore();
      },
    },
  ];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Doughnut data={chartData} options={options} plugins={plugins} />
    </div>
  );
};

export default RingChart;
