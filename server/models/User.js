const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  cumulativeScores: {
    grammar: { type: Number, default: 0, min: 0 },
    vocabulary: { type: Number, default: 0, min: 0 },
    confidence: { type: Number, default: 0, min: 0 },
    relevance: { type: Number, default: 0, min: 0 },
    overall: { type: Number, default: 0, min: 0 }
  },
  lastSessionDate: Date
}, { timestamps: true });

// Calculate streak
userSchema.methods.updateStreak = function() {
  // Get current date and reset time to start of day for proper comparison
  const now = new Date();
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // If this is the first session ever
  if (!this.lastSessionDate) {
    this.streak = 1;
    this.lastSessionDate = now;
    return this;
  }
  
  // Get last session date and reset time to start of day
  const lastSession = new Date(this.lastSessionDate);
  const lastSessionDateOnly = new Date(lastSession.getFullYear(), lastSession.getMonth(), lastSession.getDate());
  
  // Calculate difference in days
  const diffTime = nowDateOnly.getTime() - lastSessionDateOnly.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - streak should not change
    // Don't update lastSessionDate to preserve the original timestamp
  } 
  else if (diffDays === 1) {
    // Consecutive day - increment streak
    this.streak += 1;
    this.lastSessionDate = now; // Update to the current session time
  } 
  else if (diffDays > 1) {
    // Break in streak - reset to 1
    this.streak = 1;
    this.lastSessionDate = now; // Update to the current session time
  }
  
  return this;
};

// Calculate average scores
userSchema.methods.getAverageScores = function() {
  if (this.totalSessions === 0) return {};
  
  return {
    grammar: Math.round(this.cumulativeScores.grammar / this.totalSessions),
    vocabulary: Math.round(this.cumulativeScores.vocabulary / this.totalSessions),
    confidence: Math.round(this.cumulativeScores.confidence / this.totalSessions),
    relevance: Math.round(this.cumulativeScores.relevance / this.totalSessions),
    overall: Math.round(this.cumulativeScores.overall / this.totalSessions)
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;