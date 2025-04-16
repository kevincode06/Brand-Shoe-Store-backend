const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());

// Body parsing middleware with proper error handling
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Debugging middleware for /api/auth endpoints
app.use((req, res, next) => {
  if (req.originalUrl.includes('/api/auth')) {
    const oldJson = app.response.json;
    app.response.json = function(body) {
      console.log('Response:', body);
      return oldJson.call(this, body);
    };
    
    console.log('Request:', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shoes', require('./routes/shoeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Test route
app.post('/test', (req, res) => {
  console.log('Test route body:', req.body);
  res.json({ receivedBody: req.body });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;