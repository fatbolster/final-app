const express = require('express');
const expenditureRoutes = require('./routes/expenditureRoutes');
const userRoutes = require('./routes/userRoutes')
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the connectDB function
const chatGPTRoutes = require('./routes/chatGPTRoutes');
const interestRoutes = require('./routes/interestRoutes');


dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB using the function from config/db.js

const app = express();
app.use(express.json()); // For parsing JSON payloads

// Routes
app.use('/api/expenditure', expenditureRoutes);
app.use('/api/user', userRoutes);
app.use('/api/machine', chatGPTRoutes);
app.use('/api/bank', interestRoutes);


// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));