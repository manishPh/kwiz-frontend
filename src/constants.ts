/**
 * Application-wide constants for Kwiz frontend.
 * All hardcoded values should be defined here for easy maintenance.
 */

// ============================================================================
// DOMAIN & BRANDING
// ============================================================================
export const DOMAIN: string = 'kwiz.fun';
export const DOMAIN_URL: string = `https://${DOMAIN}`;
export const APP_NAME: string = 'Kwiz';
export const APP_TAGLINE: string = 'Daily Fresh Trivia';
export const APP_FULL_NAME: string = `${APP_NAME} - ${APP_TAGLINE}`;
export const APP_SHORT_NAME: string = APP_NAME; // For mobile displays

// ============================================================================
// META & SEO
// ============================================================================
export const APP_DESCRIPTION: string = 'Daily contextual trivia quizzes that adapt to current events, milestones, and trending topics!';
export const APP_TITLE: string = `${DOMAIN} - Daily Bollywood Trivia`;
export const APP_KEYWORDS: string = 'bollywood, trivia, quiz, daily quiz, bollywood quiz, indian cinema, movies';

// ============================================================================
// API CONFIGURATION
// ============================================================================
export const API_BASE_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const QUIZ_API_URL: string = `${API_BASE_URL}/api/quiz`;

// ============================================================================
// QUIZ CONFIGURATION
// ============================================================================
export const QUIZ_RELEASE_INFO: string = 'New quiz released daily at midnight IST';
export const QUIZ_TIMER_LABEL: string = "Today's Kwiz";
export const QUIZ_NEW_BADGE: string = 'NEW';

// ============================================================================
// SCORING & EMOJIS
// ============================================================================
export interface ScoreEmoji {
  EXCELLENT: string;
  GREAT: string;
  GOOD: string;
  OKAY: string;
  TRY_AGAIN: string;
}

export const SCORE_EMOJI: ScoreEmoji = {
  EXCELLENT: '🏆',  // 90%+
  GREAT: '🌟',      // 80-89%
  GOOD: '👏',       // 70-79%
  OKAY: '👍',       // 60-69%
  TRY_AGAIN: '💪'   // <60%
};

export interface ScoreThresholds {
  EXCELLENT: number;
  GREAT: number;
  GOOD: number;
  OKAY: number;
}

export const SCORE_THRESHOLDS: ScoreThresholds = {
  EXCELLENT: 90,
  GREAT: 80,
  GOOD: 70,
  OKAY: 60
};

// ============================================================================
// SHARE TEXT TEMPLATES
// ============================================================================
export const SHARE_TEXT_SUFFIX: string = `\n\nPlay daily Bollywood trivia at ${DOMAIN} 🎬`;
export const SHARE_TEXT_INSTAGRAM_SUFFIX: string = `\n\nPlay daily Bollywood trivia at ${DOMAIN} 🎬✨`;
export const SHARE_CLIPBOARD_SUCCESS: string = 'Results copied to clipboard!';
export const SHARE_INSTAGRAM_INSTRUCTION: string = 'Text copied to clipboard! Open Instagram and paste in your story or post.';

// ============================================================================
// SOCIAL MEDIA URLS
// ============================================================================
export interface SocialMediaPlatform {
  COLOR: string;
  HOVER_COLOR: string;
  SHARE_URL?: string;
  URL?: string;
}

export interface SocialMedia {
  WHATSAPP: SocialMediaPlatform;
  FACEBOOK: SocialMediaPlatform;
  INSTAGRAM: SocialMediaPlatform;
  TWITTER: SocialMediaPlatform;
}

export const SOCIAL_MEDIA: SocialMedia = {
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
export interface UIText {
  WELCOME_TITLE: string;
  WELCOME_SUBTITLE: string;
  WELCOME_DESCRIPTION: string;
  HOW_IT_WORKS_TITLE: string;
  HOW_IT_WORKS_POINTS: string[];
  NO_QUIZ_TODAY: string;
  LOADING: string;
  ERROR: string;
  PLAY_BUTTON: string;
  SUBMIT_BUTTON: string;
  SHARE_BUTTON: string;
  RETRY_BUTTON: string;
  HOME_BUTTON: string;
  STATS_TITLE: string;
  ARCHIVE_TITLE: string;
  RESULTS_TITLE: string;
}

export const UI_TEXT: UIText = {
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
export interface BackgroundImages {
  BOLLYWOOD_DEFAULT: string;
  // Add more background images as needed
}

export const BACKGROUND_IMAGES: BackgroundImages = {
  BOLLYWOOD_DEFAULT: 'https://static.toiimg.com/thumb/msid-119610150,imgsize-82628,width-400,resizemode-4/119610150.jpg',
  // Add more background images as needed
};

// ============================================================================
// RESPONSIVE BREAKPOINTS (Material-UI)
// ============================================================================
export interface Breakpoints {
  XS: string;
  SM: string;
  MD: string;
  LG: string;
  XL: string;
}

export const BREAKPOINTS: Breakpoints = {
  XS: 'xs',  // 0px
  SM: 'sm',  // 600px
  MD: 'md',  // 900px
  LG: 'lg',  // 1200px
  XL: 'xl'   // 1536px
};

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export interface StorageKeys {
  USER_STATS: string;
  QUIZ_RESULTS: string;
  THEME_PREFERENCE: string;
  LAST_PLAYED: string;
}

export const STORAGE_KEYS: StorageKeys = {
  USER_STATS: 'kwiz_user_stats',
  QUIZ_RESULTS: 'kwiz_results_',  // Append date
  THEME_PREFERENCE: 'kwiz_theme',
  LAST_PLAYED: 'kwiz_last_played'
};

// ============================================================================
// ROUTES
// ============================================================================
export interface Routes {
  HOME: string;
  QUIZ: string;
  RESULTS: string;
  ARCHIVE: string;
  ANALYTICS: string;
}

export const ROUTES: Routes = {
  HOME: '/',
  QUIZ: '/quiz/:date',
  RESULTS: '/results',
  ARCHIVE: '/archive',
  ANALYTICS: '/analytics'
};

// ============================================================================
// ICONS & EMOJIS
// ============================================================================
export interface Icons {
  MOVIE: string;
  TROPHY: string;
  STAR: string;
  FIRE: string;
  CALENDAR: string;
  CHART: string;
}

export const ICONS: Icons = {
  MOVIE: '🎬',
  TROPHY: '🏆',
  STAR: '⭐',
  FIRE: '🔥',
  CALENDAR: '📅',
  CHART: '📊'
};
