const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Adjust path if needed

// Register and Login Routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
