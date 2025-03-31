const express = require('express');
const router = express.Router();
const GeminiService = require('../services/gemini.service');

router.post('/', async (req, res) => {
  try {
    const { transcript, topic, confidenceScore } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required.' });
    }

    const feedback = await GeminiService.getFeedback({ transcript, topic, confidenceScore });
    res.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback. Please try again.' });
  }
});

module.exports = router;