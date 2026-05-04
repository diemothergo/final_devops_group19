const dataSource = require('../services/dataSource');

exports.list = async (req, res, next) => {
  try {
    const data = await dataSource.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const data = await dataSource.getById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const payload = req.body;
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }
    const data = await dataSource.create(payload);
    res.status(201).json(data);
  } catch (err) { next(err); }
};

exports.put = async (req, res, next) => {
  try {
    const payload = req.body;
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }
    const data = await dataSource.replace(req.params.id, payload);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.patch = async (req, res, next) => {
  try {
    const payload = req.body;
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }
    const data = await dataSource.patch(req.params.id, payload);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await dataSource.remove(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) { next(err); }
};
