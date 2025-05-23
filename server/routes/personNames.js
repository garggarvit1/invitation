// routes/personNames.js
const express = require('express');
const router = express.Router();
const Person = require('../model/Person');

// GET: Only return person names
router.get('/', async (req, res) => {
  try {
    const names = await Person.find({}, 'name'); // only select the 'name' field
    res.json(names);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch person names' });
  }
});

module.exports = router;
