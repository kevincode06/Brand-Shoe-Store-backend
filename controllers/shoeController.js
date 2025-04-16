const Shoe = require('../models/Shoe');

exports.getShoes = async (req, res) => {
  const filter = req.user.role === 'super_admin' ? {} : { brand: req.user.brand };
  const shoes = await Shoe.find(filter);
  res.json(shoes);
};

exports.createShoe = async (req, res) => {
  const brand = req.user.role === 'super_admin' ? req.body.brand : req.user.brand;
  const shoe = await Shoe.create({ ...req.body, brand });
  res.status(201).json(shoe);
};

exports.updateShoe = async (req, res) => {
  const shoe = await Shoe.findById(req.params.id);
  if (!shoe) return res.status(404).json({ msg: 'Not found' });

  if (req.user.role !== 'super_admin' && shoe.brand !== req.user.brand) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  Object.assign(shoe, req.body);
  await shoe.save();
  res.json(shoe);
};

exports.deleteShoe = async (req, res) => {
  const shoe = await Shoe.findById(req.params.id);
  if (!shoe) return res.status(404).json({ msg: 'Not found' });

  if (req.user.role !== 'super_admin' && shoe.brand !== req.user.brand) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  await shoe.remove();
  res.json({ msg: 'Deleted' });
};
