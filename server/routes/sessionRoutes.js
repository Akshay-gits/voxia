const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { clerkUserId, ...sessionData } = req.body;

    // Check if clerkUserId is provided
    if (!clerkUserId) {
      return res.status(400).json({ error: 'clerkUserId is required' });
    }

    // Check if user exists, if not create them
    let user = await User.findOne({ clerkUserId });
    if (!user) {
      user = new User({
        clerkUserId: clerkUserId, // Make sure clerkUserId is explicitly set
        streak: 0,
        totalSessions: 0,
        cumulativeScores: {
          grammar: 0,
          vocabulary: 0,
          confidence: 0,
          relevance: 0,
          overall: 0
        }
      });
      await user.save();
    }

    // Create and save the session
    const session = new Session({
      clerkUserId: clerkUserId, // Make sure clerkUserId is explicitly set
      ...sessionData
    });
    await session.save();

    res.status(201).json({ status: 'success', message: 'Session saved successfully' });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

module.exports = router;