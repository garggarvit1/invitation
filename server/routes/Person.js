const express = require('express');
const router = express.Router();
const Person = require('../model/Person');

router.post('/', async (req, res) => {
  try {
    const { name, age, bio, skills } = req.body;
    const newPerson = new Person({
      name,
      age,
      bio,
      skills: skills.split(',').map(skill => skill.trim()),
    });
    await newPerson.save();
    res.status(201).json({ message: 'Person saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving person' });
  }
});

module.exports = router;
