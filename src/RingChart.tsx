import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register required elements and plugins
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
  const totalExpenditure = Object.values(data).reduce(
    (acc, value) => acc + value,
    0
  );

  const chartData = {
    labels: ["Food", "Entertainment", "Shopping", "Lifestyle"],
    datasets: [
      {
        data: [data.food, data.entertainment, data.shopping, data.lifestyle],
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
            const percentage = ((value / totalExpenditure) * 100).toFixed(2);
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
        ctx.font = "bold 20px Arial"; // Adjust font size if necessary
        ctx.fillStyle = "#000"; // Text color
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw the total expenditure text
        const text = `$${totalExpenditure}`;
        ctx.fillText(text, centerX, centerY);
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
