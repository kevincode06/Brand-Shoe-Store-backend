const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getShoes,
  createShoe,
  updateShoe,
  deleteShoe,
} = require('../controllers/shoeController');

router.use(protect);
router.route('/')
  .get(getShoes)
  .post(createShoe);
router.route('/:id')
  .put(updateShoe)
  .delete(deleteShoe);

module.exports = router;
