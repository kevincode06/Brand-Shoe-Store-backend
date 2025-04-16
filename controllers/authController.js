const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register function
const register = async (req, res) => {
  console.log("Register request body:", req.body);
  
  // Add check for undefined req.body
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  
  const { name, email, password } = req.body;
  
  // Add validation for required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    
    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Login function
const login = async (req, res) => {
  // Enhanced debugging for the request
  console.log("Login request headers:", req.headers);
  console.log("Login request body:", req.body);
  console.log("Request content type:", req.headers['content-type']);
  
  // Add check for undefined req.body
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  
  const { email, password } = req.body;
  
  // Add validation for required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };