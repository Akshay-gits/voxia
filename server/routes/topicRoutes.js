const express = require('express');
const router = express.Router();
const GeminiService = require('../services/gemini.service');

router.get('/', async (req, res) => {
  try {
    const topic = await GeminiService.generateTopic();
    res.json({ topic });
  } catch (error) {
    console.error('Error generating topic:', error);
    res.status(500).json({ error: 'Failed to generate topic. Please try again.' });
  }
});

module.exports = router;