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
    origin: process.env.FRONTEND_URL,  // Your frontend URL (https://gptlearner.com)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Serve static files (if you use file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start server on all network interfaces so it's accessible externally
app.listen(PORT, "::", () => {
  console.log(`Server running on port ${PORT} (IPv4 & IPv6)`);
});

