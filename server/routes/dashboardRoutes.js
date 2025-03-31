const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

/**
 * GET /api/dashboard/stats
 * Returns user statistics including streak and average scores
 */
router.get('/stats', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Find the user
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get average scores using the model method
    const averageScores = user.getAverageScores();
    
    res.json({
      streak: user.streak,
      totalSessions: user.totalSessions,
      averageScores
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

/**
 * GET /api/dashboard/sessions
 * Returns recent practice sessions for the user
 */
router.get('/sessions', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Get the most recent sessions (limit to 10)
    const sessions = await Session.find({ clerkUserId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching recent sessions:', error);
    res.status(500).json({ error: 'Failed to fetch recent sessions' });
  }
});

/**
 * GET /api/dashboard/weekly-progress
 * Returns data for weekly progress chart
 */
router.get('/weekly-progress', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Get the current date
    const today = new Date();
    
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Find sessions within the date range
    const sessions = await Session.find({
      clerkUserId,
      createdAt: { $gte: thirtyDaysAgo, $lte: today }
    }).sort({ createdAt: 1 });
    
    // Group sessions by date and calculate average scores for each date
    const dailyData = {};
    
    sessions.forEach(session => {
      const dateStr = session.createdAt.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          count: 0,
          grammar: 0,
          vocabulary: 0,
          confidence: 0,
          relevance: 0,
          overall: 0
        };
      }
      
      dailyData[dateStr].count += 1;
      dailyData[dateStr].grammar += session.scores.grammar;
      dailyData[dateStr].vocabulary += session.scores.vocabulary;
      dailyData[dateStr].confidence += session.scores.confidence;
      dailyData[dateStr].relevance += session.scores.relevance;
      dailyData[dateStr].overall += session.scores.overall;
    });
    
    // Calculate averages and format the data for the chart
    const weeklyProgress = Object.keys(dailyData).map(date => {
      const data = dailyData[date];
      return {
        date,
        grammar: Math.round(data.grammar / data.count),
        vocabulary: Math.round(data.vocabulary / data.count),
        confidence: Math.round(data.confidence / data.count),
        relevance: Math.round(data.relevance / data.count),
        overall: Math.round(data.overall / data.count)
      };
    });
    
    res.json(weeklyProgress);
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    res.status(500).json({ error: 'Failed to fetch weekly progress' });
  }
});

/**
 * GET /api/dashboard/calendar
 * Returns data for the practice streak calendar
 */
router.get('/calendar', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Get the current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate the date 28 days ago (4 weeks)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 27); // 28 days including today
    startDate.setHours(0, 0, 0, 0);
    
    // Find sessions within the date range
    const sessions = await Session.find({
      clerkUserId,
      createdAt: { $gte: startDate, $lte: today }
    });
    
    // Create a map of dates with practice sessions
    const practiceDates = new Map();
    sessions.forEach(session => {
      const dateStr = session.createdAt.toISOString().split('T')[0];
      practiceDates.set(dateStr, true);
    });
    
    // Generate calendar data for the past 28 days
    const calendarData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isToday = currentDate.getTime() === today.getTime();
      
      calendarData.push({
        date: dateStr,
        practiced: practiceDates.has(dateStr),
        isToday
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json(calendarData);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

module.exports = router;