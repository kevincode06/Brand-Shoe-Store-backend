const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getShoes,
  createShoe,
  updateShoe,
  deleteShoe,
  getShoesByBrand
} = require('../controllers/shoeController');

// Protected routes (require authentication)
router.use(protect);
router.route('/')
  .get(getShoes)
  .post(createShoe);
router.route('/:id')
  .put(updateShoe)
  .delete(deleteShoe);

// Public route (no authentication needed)
router.get('/brand/:brand', getShoesByBrand);

module.exports = router;