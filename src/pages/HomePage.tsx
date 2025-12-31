import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Archive as ArchiveIcon,
  Movie as MovieIcon,
  AccessTime as TimeIcon,
  Quiz as QuizIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { quizAPI, DailyQuiz, QuizStatus } from '../services/api';
import QuizTimer from '../components/QuizTimer';
import ShareButtons from '../components/ShareButtons';
import {
  UI_TEXT,
  QUIZ_TIMER_LABEL,
  QUIZ_NEW_BADGE,
  SCORE_EMOJI,
  SCORE_THRESHOLDS
} from '../constants';

interface QuizResults {
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
}

function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [todayQuiz, setTodayQuiz] = useState<DailyQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quizStatus, setQuizStatus] = useState<QuizStatus | null>(null);
  const [serverToday, setServerToday] = useState<string | null>(null);

  // Get today's date in user's local timezone (fallback only)
  const getTodayLocal = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = serverToday || getTodayLocal(); // Use server's date if available, fallback to local

  // Helper function to get score emoji
  const getScoreEmoji = (percentage: number): string => {
    if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_EMOJI.EXCELLENT;
    if (percentage >= SCORE_THRESHOLDS.GREAT) return SCORE_EMOJI.GREAT;
    if (percentage >= SCORE_THRESHOLDS.GOOD) return SCORE_EMOJI.GOOD;
    if (percentage >= SCORE_THRESHOLDS.OKAY) return SCORE_EMOJI.OKAY;
    return SCORE_EMOJI.TRY_AGAIN;
  };

  // Helper function to generate share text
  const getShareText = (score: number, total: number, percentage: number): string => {
    const emoji = getScoreEmoji(percentage);
    return `${emoji} I scored ${score}/${total} (${percentage}%) on today's Kwiz!`;
  };

  // Helper function to get contextual background image based on quiz category/theme
  const getContextualBackground = (quiz: DailyQuiz | null): string | null => {
    if (!quiz) return null;

    // First priority: Use custom background_image from quiz config if provided
    if (quiz.background_image) {
      return quiz.background_image;
    }

    // Second priority: Category/theme-based backgrounds
    const category = quiz.category_name?.toLowerCase();
    const title = quiz.title?.toLowerCase();

    // Bollywood/Films category
    if (category === 'films' || title.includes('bollywood') || title.includes('shah rukh')) {
      return 'https://static.toiimg.com/thumb/msid-119610150,imgsize-82628,width-400,resizemode-4/119610150.jpg';
    }

    // Future contextual backgrounds:
    // if (title.includes('cricket') || title.includes('world cup cricket')) {
    //   return 'cricket-background-url';
    // }
    // if (title.includes('football') || title.includes('soccer')) {
    //   return 'football-background-url';
    // }
    // if (category === 'actors') {
    //   return 'actors-background-url';
    // }

    // Default Bollywood background
    return 'https://static.toiimg.com/thumb/msid-119610150,imgsize-82628,width-400,resizemode-4/119610150.jpg';
  };

  const loadTodayQuiz = useCallback(async () => {
    try {
      setLoading(true);

      // First check quiz status (don't pass date, let backend determine today)
      const status = await quizAPI.getQuizStatus();
      console.log('Quiz status:', status);
      setQuizStatus(status);

      // Use the quiz_date from backend status response (server's "today" in IST)
      const todayFromServer = status.quiz_date;
      setServerToday(todayFromServer); // Store server's date in state

      // Check if user has already completed today's quiz (using server's date)
      const hasCompletedToday = localStorage.getItem(`quiz_completed_${todayFromServer}`) === 'true';

      if (hasCompletedToday) {
        // User already completed today's quiz, show timer for next quiz
        setTodayQuiz(null);
        console.log('User has completed today\'s quiz, showing timer for next quiz');
      } else if (status.is_available) {
        // Quiz is available and user hasn't completed it, load it using server's date
        const quiz = await quizAPI.getDailyQuiz(todayFromServer);
        setTodayQuiz(quiz);
        console.log('Loading today\'s quiz for first-time user');
      } else if (status.error && status.next_quiz) {
        // No quiz today but next quiz available, show timer
        setTodayQuiz(null);
        console.log('No quiz today, showing timer for next quiz');
      } else {
        // Quiz not available yet, show timer
        setTodayQuiz(null);
        console.log('Quiz not available, showing timer');
      }
    } catch (err) {
      // If status check fails, try to load quiz directly (fallback to local date)
      try {
        const localToday = getTodayLocal();
        const hasCompletedToday = localStorage.getItem(`quiz_completed_${localToday}`) === 'true';
        if (!hasCompletedToday) {
          const quiz = await quizAPI.getDailyQuiz(localToday);
          setTodayQuiz(quiz);
          setServerToday(localToday);
          setQuizStatus({
            quiz_date: localToday,
            quiz_title: quiz.title,
            category: quiz.category_name,
            is_available: true,
            time_until_release: 0,
            next_quiz: null,
            release_time: localToday
          });
        }
      } catch (quizErr) {
        // Both failed, log error
        console.error('Failed to load quiz:', err, quizErr);
        setTodayQuiz(null);
        setQuizStatus(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayQuiz();
  }, [loadTodayQuiz]);

  const handleStartQuiz = (): void => {
    navigate(`/quiz/${today}`);
  };

  const handleViewArchive = (): void => {
    navigate('/archive');
  };

  const handleViewAnalytics = (): void => {
    navigate('/analytics');
  };




  // Debug functions for testing
  const resetQuizCompletion = (): void => {
    localStorage.removeItem(`quiz_completed_${today}`);
    localStorage.removeItem(`quiz_results_${today}`);
    localStorage.removeItem(`quiz_full_results_${today}`);
    console.log('Reset quiz completion status and results');
    loadTodayQuiz(); // Reload to show quiz
  };

  const markQuizCompleted = (): void => {
    localStorage.setItem(`quiz_completed_${today}`, 'true');
    // Add sample results for testing
    localStorage.setItem(`quiz_results_${today}`, JSON.stringify({
      score: 8,
      total: 10,
      percentage: 80,
      completedAt: new Date().toISOString()
    }));
    console.log('Marked quiz as completed with sample results');
    loadTodayQuiz(); // Reload to show timer
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(40, 40, 45, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: { xs: 2, sm: 3 },
        p: { xs: 2, sm: 3, md: 4 },
        border: '1px solid rgba(233, 30, 99, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        animation: 'fadeIn 0.6s ease-out',
      }}
    >
      {/* Hero Section */}
      <Box
        textAlign="center"
        mb={{ xs: 3, sm: 4 }}
        px={{ xs: 1, sm: 2 }}
        sx={{
          '@keyframes slideDown': {
            from: { opacity: 0, transform: 'translateY(-30px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          animation: 'slideDown 0.8s ease-out',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            mb: { xs: 1, sm: 2 },
            background: 'linear-gradient(135deg, #e91e63 0%, #ff9800 50%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(233, 30, 99, 0.3)',
          }}
        >
          {UI_TEXT.WELCOME_TITLE}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            mb: { xs: 1, sm: 2 }
          }}
        >
          {UI_TEXT.WELCOME_SUBTITLE}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: { xs: '100%', sm: '80%', md: '70%' },
            mx: 'auto'
          }}
        >
          {UI_TEXT.WELCOME_DESCRIPTION}
        </Typography>
      </Box>

      {/* Debug Panel - Only show in development */}
      {false && process.env.NODE_ENV === 'development' && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            border: '2px dashed #ccc'
          }}
        >
          <Typography variant="h6" gutterBottom>
            🔧 Debug Panel (Development Only)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Status: {localStorage.getItem(`quiz_completed_${today}`) === 'true' ? 'Quiz Completed' : 'Quiz Not Completed'}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={resetQuizCompletion}
            >
              Reset (Show Quiz)
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={markQuizCompleted}
            >
              Mark Complete (Show Timer)
            </Button>
          </Stack>
        </Box>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Quiz Timer (when quiz is not available or user completed today's quiz) */}
        {(() => {
          const hasCompletedToday = localStorage.getItem(`quiz_completed_${today}`) === 'true';
          const shouldShowTimer = hasCompletedToday ||
            (quizStatus && (quizStatus.is_available === false || quizStatus.error) && quizStatus.next_quiz);

          return shouldShowTimer && quizStatus?.next_quiz && (
            <Grid item xs={12}>
              <QuizTimer
                timeUntilRelease={quizStatus.next_quiz.time_until_release}
                nextQuiz={quizStatus.next_quiz}
                quizTitle={quizStatus.next_quiz.title}
                isAvailable={false}
              />
            </Grid>
          );
        })()}


        {/* Today's Quiz */}
        <Grid item xs={12} md={8}>
          <Card
            elevation={isMobile ? 2 : 3}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: '300px', sm: '350px' },
              backgroundImage: todayQuiz ? `url(${getContextualBackground(todayQuiz)})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: todayQuiz
                  ? 'linear-gradient(135deg, rgba(233, 30, 99, 0.85) 0%, rgba(255, 152, 0, 0.75) 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                zIndex: 1
              }
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2, sm: 3 },
                position: 'relative',
                zIndex: 2,
                color: 'white',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1, sm: 2 }}
                mb={{ xs: 2, sm: 3 }}
                flexWrap="wrap"
              >
                <MovieIcon
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                    color: 'white'
                  }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.75rem' },
                    fontWeight: 600,
                    flex: 1,
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {QUIZ_TIMER_LABEL}
                </Typography>
                <Chip
                  label={QUIZ_NEW_BADGE}
                  color="secondary"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    backgroundColor: todayQuiz ? 'rgba(255, 152, 0, 0.9)' : undefined,
                    color: todayQuiz ? 'white' : undefined
                  }}
                />
              </Stack>

              {todayQuiz ? (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      fontWeight: 600,
                      mb: { xs: 1, sm: 2 },
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {todayQuiz.title}
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2 }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    mb={{ xs: 2, sm: 3 }}
                  >
                    <Chip
                      label={todayQuiz.category_name}
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        backgroundColor: todayQuiz ? 'rgba(255, 255, 255, 0.9)' : 'primary.main',
                        color: todayQuiz ? 'primary.main' : 'white',
                        fontWeight: 600
                      }}
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <QuizIcon
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          color: 'rgba(255,255,255,0.9)'
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: 'rgba(255,255,255,0.9)',
                          textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                        }}
                      >
                        {todayQuiz.questions?.length || 10} questions
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimeIcon
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          color: 'rgba(255,255,255,0.9)'
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                          color: 'rgba(255,255,255,0.9)',
                          textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                        }}
                      >
                        5-10 minutes
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      lineHeight: 1.6,
                      mb: { xs: 2, sm: 3 },
                      color: 'rgba(255,255,255,0.95)',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
                    }}
                  >
                    {todayQuiz.description}
                  </Typography>

                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<PlayIcon />}
                    onClick={handleStartQuiz}
                    fullWidth={isMobile}
                    sx={{
                      mt: 'auto',
                      py: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 600,
                      backgroundColor: todayQuiz ? 'rgba(255, 255, 255, 0.95)' : 'primary.main',
                      color: todayQuiz ? 'primary.main' : 'white',
                      boxShadow: 4,
                      '&:hover': {
                        backgroundColor: todayQuiz ? 'rgba(255, 255, 255, 1)' : 'primary.dark',
                        boxShadow: 6,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Start Today's Kwiz
                  </Button>
                </>

              ) : (() => {
                const hasCompletedToday = localStorage.getItem(`quiz_completed_${today}`) === 'true';

                if (hasCompletedToday) {
                  // Get stored quiz results
                  const storedResults = localStorage.getItem(`quiz_results_${today}`);
                  let results: QuizResults | null = null;
                  try {
                    results = storedResults ? JSON.parse(storedResults) : null;
                  } catch (e) {
                    console.error('Error parsing stored results:', e);
                  }

                  return (
                    <Box textAlign="center" py={4}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="success.main"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        ✅ Kwiz Completed!
                      </Typography>

                      {/* Performance Display */}
                      {results && (
                        <Box sx={{ my: 2 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontSize: { xs: '1.8rem', sm: '2.2rem' },
                              fontWeight: 700,
                              color: results.percentage >= 80 ? 'success.main' :
                                results.percentage >= 60 ? 'warning.main' : 'error.main',
                              mb: 1
                            }}
                          >
                            {results.score}/{results.total}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: { xs: '1.1rem', sm: '1.3rem' },
                              fontWeight: 600,
                              color: results.percentage >= 80 ? 'success.main' :
                                results.percentage >= 60 ? 'warning.main' : 'error.main'
                            }}
                          >
                            {results.percentage}% Score
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, mt: 0.5 }}
                          >
                            {results.percentage >= 80 ? '🎉 Excellent!' :
                              results.percentage >= 60 ? '👍 Good job!' : '💪 Keep practicing!'}
                          </Typography>

                          {/* Share Buttons */}
                          <Box sx={{ mt: 3 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1.5, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
                            >
                              Share your score:
                            </Typography>
                            <ShareButtons
                              shareText={getShareText(results!.score, results!.total, results!.percentage)}
                              iconSize={38}
                              spacing={3}
                            />
                          </Box>
                        </Box>
                      )}

                      {quizStatus?.next_quiz && (
                        <>
                          <Typography
                            variant="h6"
                            gutterBottom
                            color="primary"
                            sx={{ fontSize: { xs: '1rem', sm: '1.1rem' }, mt: 2 }}
                          >
                            🕐 Next Kwiz Coming Soon
                          </Typography>
                          <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                              fontSize: { xs: '1.2rem', sm: '1.4rem' },
                              fontWeight: 600,
                              mb: 2
                            }}
                          >
                            {quizStatus.next_quiz.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                          >
                            See the countdown timer above for exact release time!
                          </Typography>
                        </>
                      )}

                      {!quizStatus?.next_quiz && (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, mt: 2 }}
                        >
                          Check back tomorrow for the next Kwiz!
                        </Typography>
                      )}
                    </Box>
                  );
                } else if (quizStatus?.next_quiz) {
                  return (
                    <Box textAlign="center" py={4}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="primary"
                        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                      >
                        🕐 Next Kwiz Coming Soon
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontSize: { xs: '1.2rem', sm: '1.4rem' },
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                        {quizStatus.next_quiz.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                      >
                        See the countdown timer above for exact release time!
                      </Typography>
                    </Box>
                  );
                } else {
                  return (
                    <Box textAlign="center" py={4}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                      >
                        No quiz available today. Check back later!
                      </Typography>
                    </Box>
                  );
                }
              })()}
            </CardContent>
          </Card>
        </Grid>


        {/* Archive Section */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ArchiveIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h3">
                  Kwiz Archive
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Missed a day? Play previous Bollywood quizzes and test your knowledge.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ArchiveIcon />}
                onClick={handleViewArchive}
              >
                View Archive
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <Card elevation={2} sx={{ mt: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AnalyticsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h3">
                  Your Analytics
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Track your progress, view score distribution, and see your Bollywood knowledge improve over time.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AnalyticsIcon />}
                onClick={handleViewAnalytics}
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card elevation={1} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                How it Works
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • New quiz released daily at midnight IST
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Special themes for birthdays, events & trending topics
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Share your results on social media
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Build your knowledge streak and challenge friends!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomePage;
