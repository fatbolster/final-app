const mongoose = require("mongoose");

const incomeHistorySchema = new mongoose.Schema({
    month: { type: String, required: true }, 
    monthlyIncome: { type: Number, required: true },
  });
  
const userSchema = new mongoose.Schema({
  ageGroup: { type: String, required: false, default: "0" },
  incomeHistory: [incomeHistorySchema], 
  targetSavings: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
