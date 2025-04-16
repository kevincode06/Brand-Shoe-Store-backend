const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/userController');

router.use(protect, permit('super_admin'));
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;
