const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,  // Replace with the URL of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow Authorization header
}));

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Database connection error:', err);
});
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// Start Server: Bind to all interfaces ("0.0.0.0") so that it is accessible externally.
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}. Public URL: https://gptlearner.com`);
});
