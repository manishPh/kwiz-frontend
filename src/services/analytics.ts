import ReactGA from 'react-ga4';

const MEASUREMENT_ID = 'G-ELBZB8VT27';

export const analytics = {
  // Initialize Google Analytics
  init: () => {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100,
      },
    });
    console.log('Google Analytics initialized with ID:', MEASUREMENT_ID);
  },

  // Track page views
  pageView: (path: string, title?: string) => {
    ReactGA.send({ hitType: 'pageview', page: path, title });
  },

  // Quiz Events
  quizStarted: (quizDate: string, category: string) => {
    ReactGA.event({
      category: 'Quiz',
      action: 'Started',
      label: quizDate,
      value: category,
    });
  },

  quizCompleted: (quizDate: string, score: number, totalQuestions: number) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    ReactGA.event({
      category: 'Quiz',
      action: 'Completed',
      label: quizDate,
      value: score,
    });
    // Also track completion percentage
    ReactGA.event({
      category: 'Quiz',
      action: 'Score Percentage',
      label: `${percentage}%`,
      value: percentage,
    });
  },

  quizAbandoned: (quizDate: string, questionsAnswered: number) => {
    ReactGA.event({
      category: 'Quiz',
      action: 'Abandoned',
      label: quizDate,
      value: questionsAnswered,
    });
  },

  // Share Events
  shareClicked: (platform: string, score: number) => {
    ReactGA.event({
      category: 'Share',
      action: 'Clicked',
      label: platform,
      value: score,
    });
  },

  // Archive Events
  archiveViewed: () => {
    ReactGA.event({
      category: 'Archive',
      action: 'Viewed',
    });
  },

  archiveQuizSelected: (quizDate: string) => {
    ReactGA.event({
      category: 'Archive',
      action: 'Quiz Selected',
      label: quizDate,
    });
  },

  // Analytics Page Events
  analyticsViewed: () => {
    ReactGA.event({
      category: 'Analytics',
      action: 'Viewed',
    });
  },

  // Timer Events
  timerViewed: (timeUntilRelease: number) => {
    ReactGA.event({
      category: 'Timer',
      action: 'Viewed',
      label: 'Next Quiz Countdown',
      value: Math.round(timeUntilRelease / 60), // Convert to minutes
    });
  },

  // Navigation Events
  homeViewed: () => {
    ReactGA.event({
      category: 'Navigation',
      action: 'Home Viewed',
    });
  },
};

