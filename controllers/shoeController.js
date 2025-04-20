const Shoe = require('../models/Shoe');

// Get all shoes (admin sees all, others see only their brand)
exports.getShoes = async (req, res) => {
  try {
    const filter = req.user.role === 'super_admin' ? {} : { brand: req.user.brand };
    const shoes = await Shoe.find(filter);
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shoes by brand (public endpoint)
exports.getShoesByBrand = async (req, res) => {
  try {
    const shoes = await Shoe.find({ brand: req.params.brand });
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new shoe
exports.createShoe = async (req, res) => {
  try {
    const brand = req.user.role === 'super_admin' ? req.body.brand : req.user.brand;
    const shoe = await Shoe.create({ ...req.body, brand });
    res.status(201).json(shoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update shoe
exports.updateShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ msg: 'Not found' });

    if (req.user.role !== 'super_admin' && shoe.brand !== req.user.brand) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    Object.assign(shoe, req.body);
    await shoe.save();
    res.json(shoe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete shoe
exports.deleteShoe = async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) return res.status(404).json({ msg: 'Not found' });

    if (req.user.role !== 'super_admin' && shoe.brand !== req.user.brand) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    await shoe.remove();
    res.json({ msg: 'Deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};