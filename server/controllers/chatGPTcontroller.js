require('dotenv').config();
const User = require('../models/userModel');
const Expenditure = require('../models/expenditureModel');
const axios = require('axios');

const analyzeSpending = async (req, res) => {
    try {
        const { month } = req.query;
        if (!month) {
            return res.status(400).json({ message: 'Month is required as a query parameter (e.g., ?month=2025-01)' });
        }

        const user = await User.findOne();
        if (!user) {
            return res.status(404).json({ message: 'User demographic data not found' });
        }

        const expenditure = await Expenditure.findOne({ month });
        if (!expenditure) {
            return res.status(404).json({ message: `No expenditure data found for the month: ${month}` });
        }

        const categoryTotals = {};
        expenditure.allocation.forEach(allocationItem => {
            const category = allocationItem.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            allocationItem.transactions.forEach(transaction => {
                categoryTotals[category] += transaction.amount;
            });
        });

        const prompt = `
User Demographic Information:
- Age Group: ${user.ageGroup}
- Monthly Income: $${user.monthlyIncome}
- Monthly Budget: $${user.monthlyBudget}
- Target Net Worth: $${user.targetNetWorth}

User Spending Information for ${month}:
${Object.entries(categoryTotals)
    .map(([category, total]) => `- ${category}: $${total.toFixed(2)}`)
    .join('\n')}

Task:
Analyze the user's spending habits relative to their demographic profile. Identify overspending or underspending and provide actionable financial advice.
`;

        const gptResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial advisor providing spending analysis and actionable advice based on user demographics and spending data.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 1000,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        res.status(200).json({
            analysis: gptResponse.data.choices[0].message.content.trim(),
        });
    } catch (error) {
        console.error("Error Details:", error.response?.data || error.message);
        res.status(500).json({ message: 'Error analyzing spending', error: error.message });
    }
};

module.exports = { analyzeSpending };