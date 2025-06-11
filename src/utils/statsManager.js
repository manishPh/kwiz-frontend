// Efficient Kwiz statistics management using localStorage

const STATS_KEY = 'kwiz-stats';

// Initialize default stats structure
const getDefaultStats = () => ({
  totalPlayed: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  accuracy: 0,
  currentStreak: 0,
  maxStreak: 0,
  categoryStats: {},
  scoreDistribution: {
    '0-5': 0,   // 5 or less
    '6': 0,     // 6/10
    '7': 0,     // 7/10
    '8': 0,     // 8/10
    '9': 0,     // 9/10
    '10': 0     // 10/10 (perfect)
  },
  lastPlayed: null,
  perfectScores: 0,
  averageScore: 0,
  bestCategory: null,
  totalTimePlayed: 0 // in minutes (estimated)
});

// Get current stats from localStorage
export const getStats = () => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return getDefaultStats();

    const stats = JSON.parse(stored);
    // Merge with defaults to handle new fields
    return { ...getDefaultStats(), ...stats };
  } catch (error) {
    console.error('Error loading stats:', error);
    return getDefaultStats();
  }
};

// Save stats to localStorage
const saveStats = (stats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
};

// Get score distribution bucket based on actual score out of 10
const getScoreBucket = (score, total) => {
  // Convert to score out of 10
  const scoreOutOf10 = Math.round((score / total) * 10);

  if (scoreOutOf10 <= 5) return '0-5';
  if (scoreOutOf10 === 6) return '6';
  if (scoreOutOf10 === 7) return '7';
  if (scoreOutOf10 === 8) return '8';
  if (scoreOutOf10 === 9) return '9';
  return '10';
};

// Update streak based on play dates
const updateStreak = (stats, quizDate) => {
  const today = new Date(quizDate);
  const lastPlayed = stats.lastPlayed ? new Date(stats.lastPlayed) : null;

  if (!lastPlayed) {
    // First game ever
    stats.currentStreak = 1;
  } else {
    const daysDiff = Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      stats.currentStreak += 1;
    } else if (daysDiff === 0) {
      // Same day (shouldn't happen with daily quizzes, but handle it)
      // Don't change streak
    } else {
      // Missed days, reset streak
      stats.currentStreak = 1;
    }
  }

  // Update max streak
  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  stats.lastPlayed = quizDate;
};

// Update category statistics
const updateCategoryStats = (stats, category, score, total) => {
  if (!stats.categoryStats[category]) {
    stats.categoryStats[category] = {
      played: 0,
      totalScore: 0,
      totalQuestions: 0,
      avgScore: 0,
      accuracy: 0
    };
  }

  const catStats = stats.categoryStats[category];
  catStats.played += 1;
  catStats.totalScore += score;
  catStats.totalQuestions += total;
  catStats.avgScore = Number((catStats.totalScore / catStats.played).toFixed(1));
  catStats.accuracy = Math.round((catStats.totalScore / catStats.totalQuestions) * 100);
};

// Find best performing category
const updateBestCategory = (stats) => {
  let bestCategory = null;
  let bestAccuracy = 0;

  Object.entries(stats.categoryStats).forEach(([category, catStats]) => {
    if (catStats.played >= 2 && catStats.accuracy > bestAccuracy) {
      bestAccuracy = catStats.accuracy;
      bestCategory = category;
    }
  });

  stats.bestCategory = bestCategory;
};

// Main function to update stats after quiz completion
export const updateStatsAfterQuiz = (quizResults, quizDate, category) => {
  const stats = getStats();

  // Update basic stats
  stats.totalPlayed += 1;
  stats.totalCorrect += quizResults.score;
  stats.totalQuestions += quizResults.total;
  stats.accuracy = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
  stats.averageScore = Number((stats.totalCorrect / stats.totalPlayed).toFixed(1));

  // Update perfect scores
  if (quizResults.score === quizResults.total) {
    stats.perfectScores += 1;
  }

  // Update streak
  updateStreak(stats, quizDate);

  // Update score distribution
  const bucket = getScoreBucket(quizResults.score, quizResults.total);
  stats.scoreDistribution[bucket] += 1;

  // Update category stats
  updateCategoryStats(stats, category, quizResults.score, quizResults.total);

  // Update best category
  updateBestCategory(stats);

  // Estimate time played (assume 1-2 minutes per quiz)
  stats.totalTimePlayed += 1.5;

  // Save updated stats and store recent score for highlighting
  stats.recentScore = Math.round((quizResults.score / quizResults.total) * 10);
  saveStats(stats);

  return stats;
};

// Get formatted stats for display
export const getFormattedStats = () => {
  const stats = getStats();

  return {
    ...stats,
    winPercentage: stats.totalPlayed > 0 ?
      Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0,
    averagePercentage: stats.totalPlayed > 0 ?
      Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0,
    gamesWithPerfectScore: stats.perfectScores,
    totalHoursPlayed: Math.round(stats.totalTimePlayed / 60 * 10) / 10,
    categoriesPlayed: Object.keys(stats.categoryStats).length
  };
};

// Reset all stats (for testing or user request)
export const resetStats = () => {
  localStorage.removeItem(STATS_KEY);
  return getDefaultStats();
};

// Export stats for sharing or backup
export const exportStats = () => {
  return JSON.stringify(getStats(), null, 2);
};

// Import stats from backup
export const importStats = (statsJson) => {
  try {
    const stats = JSON.parse(statsJson);
    saveStats(stats);
    return true;
  } catch (error) {
    console.error('Error importing stats:', error);
    return false;
  }
};
