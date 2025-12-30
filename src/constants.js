/**
 * Application-wide constants for Kwiz frontend.
 * All hardcoded values should be defined here for easy maintenance.
 */

// ============================================================================
// DOMAIN & BRANDING
// ============================================================================
export const DOMAIN = 'kwiz.fun';
export const DOMAIN_URL = `https://${DOMAIN}`;
export const APP_NAME = 'Kwiz';
export const APP_TAGLINE = 'Daily Fresh Trivia';
export const APP_FULL_NAME = `${APP_NAME} - ${APP_TAGLINE}`;
export const APP_SHORT_NAME = APP_NAME; // For mobile displays

// ============================================================================
// META & SEO
// ============================================================================
export const APP_DESCRIPTION = 'Daily contextual trivia quizzes that adapt to current events, milestones, and trending topics!';
export const APP_TITLE = `${DOMAIN} - Daily Bollywood Trivia`;
export const APP_KEYWORDS = 'bollywood, trivia, quiz, daily quiz, bollywood quiz, indian cinema, movies';

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const QUIZ_API_URL = `${API_BASE_URL}/api/quiz`;

// ============================================================================
// QUIZ CONFIGURATION
// ============================================================================
export const QUIZ_RELEASE_INFO = 'New quiz released daily at midnight IST';
export const QUIZ_TIMER_LABEL = "Today's Kwiz";
export const QUIZ_NEW_BADGE = 'NEW';

// ============================================================================
// SCORING & EMOJIS
// ============================================================================
export const SCORE_EMOJI = {
  EXCELLENT: '🏆',  // 90%+
  GREAT: '🌟',      // 80-89%
  GOOD: '👏',       // 70-79%
  OKAY: '👍',       // 60-69%
  TRY_AGAIN: '💪'   // <60%
};

export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GREAT: 80,
  GOOD: 70,
  OKAY: 60
};

// ============================================================================
// SHARE TEXT TEMPLATES
// ============================================================================
export const SHARE_TEXT_SUFFIX = `\n\nPlay daily Bollywood trivia at ${DOMAIN} 🎬`;
export const SHARE_TEXT_INSTAGRAM_SUFFIX = `\n\nPlay daily Bollywood trivia at ${DOMAIN} 🎬✨`;
export const SHARE_CLIPBOARD_SUCCESS = 'Results copied to clipboard!';
export const SHARE_INSTAGRAM_INSTRUCTION = 'Text copied to clipboard! Open Instagram and paste in your story or post.';

// ============================================================================
// SOCIAL MEDIA URLS
// ============================================================================
export const SOCIAL_MEDIA = {
  WHATSAPP: {
    COLOR: '#25D366',
    HOVER_COLOR: '#128C7E',
    SHARE_URL: 'https://wa.me/?text='
  },
  FACEBOOK: {
    COLOR: '#1877F2',
    HOVER_COLOR: '#166FE5',
    SHARE_URL: `https://www.facebook.com/sharer/sharer.php?u=${DOMAIN}&quote=`
  },
  INSTAGRAM: {
    COLOR: '#E4405F',
    HOVER_COLOR: '#D62976',
    URL: 'https://www.instagram.com/'
  },
  TWITTER: {
    COLOR: '#1DA1F2',
    HOVER_COLOR: '#0C85D0',
    SHARE_URL: 'https://twitter.com/intent/tweet?text='
  }
};

// ============================================================================
// UI TEXT & LABELS
// ============================================================================
export const UI_TEXT = {
  WELCOME_TITLE: `🎬 Welcome to ${DOMAIN}`,
  WELCOME_SUBTITLE: 'Your daily dose of fresh trivia',
  WELCOME_DESCRIPTION: "New quizzes every day based on what's happening now and special occasions",
  
  HOW_IT_WORKS_TITLE: 'How it Works',
  HOW_IT_WORKS_POINTS: [
    'New quiz released daily at midnight IST',
    'Special themes for birthdays, events & trending topics',
    'Share your results on social media',
    'Build your knowledge streak and challenge friends!'
  ],
  
  NO_QUIZ_TODAY: 'No quiz available yet',
  LOADING: 'Loading...',
  ERROR: 'Something went wrong',
  
  PLAY_BUTTON: 'Play Now',
  SUBMIT_BUTTON: 'Submit Quiz',
  SHARE_BUTTON: 'Share Results',
  RETRY_BUTTON: 'Try Again',
  HOME_BUTTON: 'Back to Home',
  
  STATS_TITLE: 'Your Stats',
  ARCHIVE_TITLE: 'Quiz Archive',
  RESULTS_TITLE: 'Quiz Results'
};

// ============================================================================
// BACKGROUND IMAGES
// ============================================================================
export const BACKGROUND_IMAGES = {
  BOLLYWOOD_DEFAULT: 'https://static.toiimg.com/thumb/msid-119610150,imgsize-82628,width-400,resizemode-4/119610150.jpg',
  // Add more background images as needed
};

// ============================================================================
// RESPONSIVE BREAKPOINTS (Material-UI)
// ============================================================================
export const BREAKPOINTS = {
  XS: 'xs',  // 0px
  SM: 'sm',  // 600px
  MD: 'md',  // 900px
  LG: 'lg',  // 1200px
  XL: 'xl'   // 1536px
};

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  USER_STATS: 'kwiz_user_stats',
  QUIZ_RESULTS: 'kwiz_results_',  // Append date
  THEME_PREFERENCE: 'kwiz_theme',
  LAST_PLAYED: 'kwiz_last_played'
};

// ============================================================================
// ROUTES
// ============================================================================
export const ROUTES = {
  HOME: '/',
  QUIZ: '/quiz/:date',
  RESULTS: '/results',
  ARCHIVE: '/archive',
  ANALYTICS: '/analytics'
};

// ============================================================================
// ICONS & EMOJIS
// ============================================================================
export const ICONS = {
  MOVIE: '🎬',
  TROPHY: '🏆',
  STAR: '⭐',
  FIRE: '🔥',
  CALENDAR: '📅',
  CHART: '📊'
};

