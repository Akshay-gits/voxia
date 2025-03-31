const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  duration: {
    type: Number, // in seconds
    required: true,
    min: 1
  },
  scores: {
    grammar: { type: Number, required: true, min: 0, max: 100 },
    vocabulary: { type: Number, required: true, min: 0, max: 100 },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    relevance: { type: Number, required: true, min: 0, max: 100 },
    overall: { type: Number, required: true, min: 0, max: 100 }
  },
  feedback: {
    recentFeedback: String // Simplified to just recent feedback
  }
}, { timestamps: true });

// Pre-save hook to update user stats
sessionSchema.pre('save', async function(next) {
  try {
    const User = require('./User');
    const user = await User.findOne({ clerkUserId: this.clerkUserId });
    
    if (user) {
      // Update cumulative scores
      for (const key in this.scores) {
        user.cumulativeScores[key] = (user.cumulativeScores[key] || 0) + this.scores[key];
      }
      
      // Update session count and streak
      user.totalSessions += 1;
      user.updateStreak();
      
      await user.save();
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Format duration for display (mm:ss)
sessionSchema.methods.formatDuration = function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;